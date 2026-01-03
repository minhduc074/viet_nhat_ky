const prisma = require('../config/prisma');

// UTC+7 offset in milliseconds
const UTC7_OFFSET = 7 * 60 * 60 * 1000;

// Helper: Get current time in UTC+7
const getNowUTC7 = () => {
  const now = new Date();
  return new Date(now.getTime() + UTC7_OFFSET);
};

// Helper: Get today's date (start of day) in UTC+7
const getToday = () => {
  const nowUTC7 = getNowUTC7();
  // Create a date that represents midnight UTC+7
  const today = new Date(Date.UTC(
    nowUTC7.getUTCFullYear(),
    nowUTC7.getUTCMonth(),
    nowUTC7.getUTCDate(),
    0, 0, 0, 0
  ));
  // Adjust back to represent UTC+7 midnight in UTC
  today.setTime(today.getTime() - UTC7_OFFSET);
  return today;
};

// Helper: Add mood label to entry
const addMoodLabel = (entry) => {
  if (!entry) return null;
  const labels = {
    1: 'Rất tệ',
    2: 'Tệ',
    3: 'Bình thường',
    4: 'Tốt',
    5: 'Tuyệt vời'
  };
  return {
    ...entry,
    moodLabel: labels[entry.moodScore] || 'Không xác định'
  };
};

// @desc    Tạo hoặc cập nhật entry hôm nay
// @route   POST /api/entries
// @access  Private
const createOrUpdateEntry = async (req, res, next) => {
  try {
    const { moodScore, note, tags } = req.body;
    const today = getToday();
    
    // Upsert: Create or Update
    const entry = await prisma.dailyEntry.upsert({
      where: {
        userId_date: {
          userId: req.userId,
          date: today
        }
      },
      update: {
        moodScore,
        note: note || null,
        tags: tags || []
      },
      create: {
        userId: req.userId,
        date: today,
        moodScore,
        note: note || null,
        tags: tags || []
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Ghi nhận cảm xúc thành công',
      data: { entry: addMoodLabel(entry) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy entry hôm nay
// @route   GET /api/entries/today
// @access  Private
const getTodayEntry = async (req, res, next) => {
  try {
    const today = getToday();
    
    const entry = await prisma.dailyEntry.findUnique({
      where: {
        userId_date: {
          userId: req.userId,
          date: today
        }
      }
    });
    
    res.json({
      success: true,
      data: {
        entry: addMoodLabel(entry),
        hasEntry: !!entry
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy danh sách entries theo tháng
// @route   GET /api/entries?year=2024&month=1
// @access  Private
const getEntries = async (req, res, next) => {
  try {
    const nowUTC7 = getNowUTC7();
    const year = parseInt(req.query.year) || nowUTC7.getUTCFullYear();
    const month = parseInt(req.query.month) || nowUTC7.getUTCMonth() + 1;
    
    // Start of month in UTC+7 (converted to UTC)
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    startDate.setTime(startDate.getTime() - UTC7_OFFSET);
    
    // End of month in UTC+7 (converted to UTC)
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = new Date(Date.UTC(year, month - 1, lastDay, 23, 59, 59, 999));
    endDate.setTime(endDate.getTime() - UTC7_OFFSET);
    
    const entries = await prisma.dailyEntry.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'desc' }
    });
    
    res.json({
      success: true,
      data: {
        entries: entries.map(addMoodLabel),
        count: entries.length,
        year,
        month
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy entry theo ID
// @route   GET /api/entries/:id
// @access  Private
const getEntryById = async (req, res, next) => {
  try {
    const entry = await prisma.dailyEntry.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy entry'
      });
    }
    
    res.json({
      success: true,
      data: { entry: addMoodLabel(entry) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa entry (chỉ cho phép xóa entry hôm nay)
// @route   DELETE /api/entries/:id
// @access  Private
const deleteEntry = async (req, res, next) => {
  try {
    const entry = await prisma.dailyEntry.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy entry'
      });
    }
    
    // Kiểm tra xem có phải entry hôm nay không
    const today = getToday();
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    
    if (entryDate.getTime() !== today.getTime()) {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể xóa entry của ngày hôm nay'
      });
    }
    
    await prisma.dailyEntry.delete({
      where: { id: req.params.id }
    });
    
    res.json({
      success: true,
      message: 'Xóa entry thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy entries theo khoảng ngày
// @route   GET /api/entries/range?startDate=2024-01-01&endDate=2024-01-31
// @access  Private
const getEntriesByRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp startDate và endDate'
      });
    }
    
    // Parse dates as UTC+7
    const startParts = startDate.split('-').map(Number);
    const start = new Date(Date.UTC(startParts[0], startParts[1] - 1, startParts[2], 0, 0, 0, 0));
    start.setTime(start.getTime() - UTC7_OFFSET);
    
    const endParts = endDate.split('-').map(Number);
    const end = new Date(Date.UTC(endParts[0], endParts[1] - 1, endParts[2], 23, 59, 59, 999));
    end.setTime(end.getTime() - UTC7_OFFSET);
    
    const entries = await prisma.dailyEntry.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: start,
          lte: end
        }
      },
      orderBy: { date: 'desc' }
    });
    
    res.json({
      success: true,
      data: {
        entries: entries.map(addMoodLabel),
        count: entries.length
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateEntry,
  getTodayEntry,
  getEntries,
  getEntryById,
  deleteEntry,
  getEntriesByRange
};
