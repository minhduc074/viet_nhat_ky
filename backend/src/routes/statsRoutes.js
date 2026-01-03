const express = require('express');
const router = express.Router();
const { statsController } = require('../controllers');
const { authenticate } = require('../middleware');

// Tất cả routes đều cần authentication
router.use(authenticate);

/**
 * @swagger
 * /api/stats/monthly:
 *   get:
 *     summary: Get monthly statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *     responses:
 *       200:
 *         description: Monthly statistics
 */
router.get('/monthly', statsController.getMonthlyStats);

/**
 * @swagger
 * /api/stats/weekly:
 *   get:
 *     summary: Get weekly statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics for the last 7 days
 */
router.get('/weekly', statsController.getWeeklyStats);

/**
 * @swagger
 * /api/stats/streak:
 *   get:
 *     summary: Get current writing streak
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current streak information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 streak:
 *                   type: object
 *                   properties:
 *                     currentStreak:
 *                       type: integer
 *                     longestStreak:
 *                       type: integer
 */
router.get('/streak', statsController.getStreak);

/**
 * @swagger
 * /api/stats/overview:
 *   get:
 *     summary: Get overall statistics overview
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete overview of user statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalEntries:
 *                       type: integer
 *                     averageMood:
 *                       type: number
 *                     currentStreak:
 *                       type: integer
 *                     longestStreak:
 *                       type: integer
 */
router.get('/overview', statsController.getOverview);

module.exports = router;
