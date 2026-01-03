require('dotenv').config();

module.exports = {
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Mood Score Range
  moodScoreMin: 1,
  moodScoreMax: 5,
  
  // Predefined Tags
  defaultTags: [
    'Công việc',
    'Gia đình',
    'Sức khỏe',
    'Tình yêu',
    'Bạn bè',
    'Thể thao',
    'Học tập',
    'Giải trí',
    'Tài chính',
    'Khác'
  ]
};
