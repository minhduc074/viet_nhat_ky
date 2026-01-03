const prisma = require('../config/prisma');

// UTC+7 offset in milliseconds
const UTC7_OFFSET = 7 * 60 * 60 * 1000;

// Helper: Get current time in UTC+7
const getNowUTC7 = () => {
  const now = new Date();
  return new Date(now.getTime() + UTC7_OFFSET);
};

// Helper: Get today's date (start of day) in UTC+7
const getTodayUTC7 = () => {
  const nowUTC7 = getNowUTC7();
  const today = new Date(Date.UTC(
    nowUTC7.getUTCFullYear(),
    nowUTC7.getUTCMonth(),
    nowUTC7.getUTCDate(),
    0, 0, 0, 0
  ));
  today.setTime(today.getTime() - UTC7_OFFSET);
  return today;
};

// @desc    Thống kê theo tháng
// @route   GET /api/stats/monthly?year=2024&month=1
// @access  Private
const getMonthlyStats = async (req, res, next) => {
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
        date: { gte: startDate, lte: endDate }
      }
    });
    
    const stats = {
      totalEntries: entries.length,
      averageMood: 0,
      moodDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      tagStats: {}
    };
    
    if (entries.length > 0) {
      let totalMood = 0;
      
      entries.forEach(entry => {
        totalMood += entry.moodScore;
        stats.moodDistribution[entry.moodScore]++;
        
        entry.tags.forEach(tag => {
          stats.tagStats[tag] = (stats.tagStats[tag] || 0) + 1;
        });
      });
      
      stats.averageMood = parseFloat((totalMood / entries.length).toFixed(2));
    }
    
    res.json({
      success: true,
      data: { stats, year, month }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Thống kê theo tuần
// @route   GET /api/stats/weekly?date=2024-01-15
// @access  Private
const getWeeklyStats = async (req, res, next) => {
  try {
    // Parse date as UTC+7
    let dateUTC7;
    if (req.query.date) {
      const parts = req.query.date.split('-').map(Number);
      dateUTC7 = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0));
    } else {
      dateUTC7 = getNowUTC7();
    }
    
    // Tính ngày đầu tuần (Thứ 2) in UTC+7
    const dayOfWeek = dateUTC7.getUTCDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(Date.UTC(
      dateUTC7.getUTCFullYear(),
      dateUTC7.getUTCMonth(),
      dateUTC7.getUTCDate() + diff,
      0, 0, 0, 0
    ));
    startOfWeek.setTime(startOfWeek.getTime() - UTC7_OFFSET);
    
    // Tính ngày cuối tuần (Chủ nhật) in UTC+7
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000 + 999);
    
    const entries = await prisma.dailyEntry.findMany({
      where: {
        userId: req.userId,
        date: { gte: startOfWeek, lte: endOfWeek }
      },
      orderBy: { date: 'asc' }
    });
    
    // Tạo array 7 ngày với dữ liệu
    const weekDays = [];
    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000 + UTC7_OFFSET);
      const dateStr = `${currentDate.getUTCFullYear()}-${String(currentDate.getUTCMonth() + 1).padStart(2, '0')}-${String(currentDate.getUTCDate()).padStart(2, '0')}`;
      
      const entry = entries.find(e => {
        const entryDate = new Date(e.date.getTime() + UTC7_OFFSET);
        const entryDateStr = `${entryDate.getUTCFullYear()}-${String(entryDate.getUTCMonth() + 1).padStart(2, '0')}-${String(entryDate.getUTCDate()).padStart(2, '0')}`;
        return entryDateStr === dateStr;
      });
      
      weekDays.push({
        date: dateStr,
        dayName: dayNames[i],
        moodScore: entry ? entry.moodScore : null,
        hasEntry: !!entry
      });
    }
    
    // Tính average mood
    const entriesWithMood = weekDays.filter(d => d.moodScore !== null);
    const averageMood = entriesWithMood.length > 0
      ? parseFloat((entriesWithMood.reduce((sum, d) => sum + d.moodScore, 0) / entriesWithMood.length).toFixed(2))
      : 0;
    
    // Format dates for response
    const startDateUTC7 = new Date(startOfWeek.getTime() + UTC7_OFFSET);
    const endDateUTC7 = new Date(endOfWeek.getTime() + UTC7_OFFSET);
    const startDateStr = `${startDateUTC7.getUTCFullYear()}-${String(startDateUTC7.getUTCMonth() + 1).padStart(2, '0')}-${String(startDateUTC7.getUTCDate()).padStart(2, '0')}`;
    const endDateStr = `${endDateUTC7.getUTCFullYear()}-${String(endDateUTC7.getUTCMonth() + 1).padStart(2, '0')}-${String(endDateUTC7.getUTCDate()).padStart(2, '0')}`;
    
    res.json({
      success: true,
      data: {
        weekDays,
        totalEntries: entriesWithMood.length,
        averageMood,
        startDate: startDateStr,
        endDate: endDateStr
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Streak - Số ngày liên tiếp ghi nhật ký
// @route   GET /api/stats/streak
// @access  Private
const getStreak = async (req, res, next) => {
  try {
    // Lấy tất cả entries, sort theo ngày giảm dần
    const entries = await prisma.dailyEntry.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
      select: { date: true }
    });
    
    if (entries.length === 0) {
      return res.json({
        success: true,
        data: { currentStreak: 0, longestStreak: 0 }
      });
    }
    
    // Tính current streak using UTC+7
    let currentStreak = 0;
    const today = getTodayUTC7();
    
    // Convert entries to UTC+7 date strings for comparison
    const entryDates = entries.map(e => {
      const dateUTC7 = new Date(e.date.getTime() + UTC7_OFFSET);
      return `${dateUTC7.getUTCFullYear()}-${String(dateUTC7.getUTCMonth() + 1).padStart(2, '0')}-${String(dateUTC7.getUTCDate()).padStart(2, '0')}`;
    });
    
    for (let i = 0; i < entryDates.length; i++) {
      const expectedDate = new Date(today.getTime() + UTC7_OFFSET - i * 24 * 60 * 60 * 1000);
      const expectedDateStr = `${expectedDate.getUTCFullYear()}-${String(expectedDate.getUTCMonth() + 1).padStart(2, '0')}-${String(expectedDate.getUTCDate()).padStart(2, '0')}`;
      
      if (entryDates[i] === expectedDateStr) {
        currentStreak++;
      } else if (i === 0) {
        // Check if yesterday
        const yesterdayDate = new Date(today.getTime() + UTC7_OFFSET - 24 * 60 * 60 * 1000);
        const yesterdayStr = `${yesterdayDate.getUTCFullYear()}-${String(yesterdayDate.getUTCMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getUTCDate()).padStart(2, '0')}`;
        if (entryDates[i] === yesterdayStr) {
          currentStreak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    
    // Tính longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    
    for (let i = 1; i < entries.length; i++) {
      const prevDate = new Date(entries[i - 1].date);
      const currentDate = new Date(entries[i].date);
      
      const diffDays = Math.round((prevDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    res.json({
      success: true,
      data: { currentStreak, longestStreak }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Thống kê tổng quan
// @route   GET /api/stats/overview
// @access  Private
const getOverview = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    // Tổng số entries
    const totalEntries = await prisma.dailyEntry.count({
      where: { userId }
    });
    
    // Entry đầu tiên
    const firstEntry = await prisma.dailyEntry.findFirst({
      where: { userId },
      orderBy: { date: 'asc' },
      select: { date: true }
    });
    
    // Lấy tất cả entries để tính stats
    const entries = await prisma.dailyEntry.findMany({
      where: { userId },
      select: { moodScore: true, tags: true }
    });
    
    // Average mood
    let averageMood = 0;
    if (entries.length > 0) {
      const totalMood = entries.reduce((sum, e) => sum + e.moodScore, 0);
      averageMood = parseFloat((totalMood / entries.length).toFixed(2));
    }
    
    // Tag stats
    const tagCounts = {};
    entries.forEach(e => {
      e.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Mood distribution
    const moodDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    entries.forEach(e => {
      moodDistribution[e.moodScore]++;
    });
    
    res.json({
      success: true,
      data: {
        totalEntries,
        firstEntryDate: firstEntry ? firstEntry.date : null,
        averageMood,
        topTags,
        moodDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMonthlyStats,
  getWeeklyStats,
  getStreak,
  getOverview
};
