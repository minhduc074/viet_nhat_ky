const express = require('express');
const router = express.Router();
const { statsController } = require('../controllers');
const { authenticate } = require('../middleware');

// Tất cả routes đều cần authentication
router.use(authenticate);

// Routes
router.get('/monthly', statsController.getMonthlyStats);
router.get('/weekly', statsController.getWeeklyStats);
router.get('/streak', statsController.getStreak);
router.get('/overview', statsController.getOverview);

module.exports = router;
