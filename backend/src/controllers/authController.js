const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

// Helper: Format user response (không có password)
const formatUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// @desc    Đăng ký tài khoản mới
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0]
      }
    });
    
    // Tạo token
    const token = generateToken(user.id);
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: formatUser(user),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Tìm user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }
    
    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }
    
    // Tạo token
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: formatUser(user),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: formatUser(req.user)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật thông tin user
// @route   PUT /api/auth/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData
    });
    
    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: {
        user: formatUser(user)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Đổi mật khẩu
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Lấy user với password
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }
    
    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Cập nhật mật khẩu
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword }
    });
    
    // Tạo token mới
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
      data: { token }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  changePassword
};
