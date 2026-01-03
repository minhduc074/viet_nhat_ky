const { body, param, query, validationResult } = require('express-validator');

// Middleware kiểm tra kết quả validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array().map(e => e.msg)
    });
  }
  next();
};

// Validation rules cho Auth
const authValidation = {
  register: [
    body('email')
      .isEmail().withMessage('Email không hợp lệ')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('name')
      .optional()
      .trim()
      .isLength({ max: 50 }).withMessage('Tên không được quá 50 ký tự'),
    validate
  ],
  login: [
    body('email')
      .isEmail().withMessage('Email không hợp lệ')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Mật khẩu là bắt buộc'),
    validate
  ]
};

// Validation rules cho Entry
const entryValidation = {
  createOrUpdate: [
    body('moodScore')
      .isInt({ min: 1, max: 5 }).withMessage('Điểm cảm xúc phải từ 1-5'),
    body('note')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Ghi chú không được quá 500 ký tự'),
    body('tags')
      .optional()
      .isArray({ max: 5 }).withMessage('Chỉ được chọn tối đa 5 tags'),
    validate
  ],
  getByMonth: [
    query('year')
      .optional()
      .isInt({ min: 2020, max: 2100 }).withMessage('Năm không hợp lệ'),
    query('month')
      .optional()
      .isInt({ min: 1, max: 12 }).withMessage('Tháng phải từ 1-12'),
    validate
  ]
};

module.exports = {
  validate,
  authValidation,
  entryValidation
};
