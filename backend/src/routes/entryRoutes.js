const express = require('express');
const router = express.Router();
const { entryController } = require('../controllers');
const { authenticate } = require('../middleware');
const { entryValidation } = require('../validators');

// Tất cả routes đều cần authentication
router.use(authenticate);

/**
 * @swagger
 * /api/entries:
 *   post:
 *     summary: Create or update daily entry
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - moodScore
 *               - date
 *             properties:
 *               content:
 *                 type: string
 *               moodScore:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Entry created/updated successfully
 *       400:
 *         description: Validation error
 */
router.post('/', entryValidation.createOrUpdate, entryController.createOrUpdateEntry);

/**
 * @swagger
 * /api/entries/today:
 *   get:
 *     summary: Get today's entry
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 entry:
 *                   $ref: '#/components/schemas/Entry'
 */
router.get('/today', entryController.getTodayEntry);

/**
 * @swagger
 * /api/entries/range:
 *   get:
 *     summary: Get entries by date range
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of entries
 */
router.get('/range', entryController.getEntriesByRange);

/**
 * @swagger
 * /api/entries/{id}:
 *   get:
 *     summary: Get entry by ID
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entry details
 *       404:
 *         description: Entry not found
 */
router.get('/:id', entryController.getEntryById);

/**
 * @swagger
 * /api/entries:
 *   get:
 *     summary: Get entries by month
 *     tags: [Entries]
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
 *         description: List of entries for the month
 */
router.get('/', entryValidation.getByMonth, entryController.getEntries);

/**
 * @swagger
 * /api/entries/{id}:
 *   delete:
 *     summary: Delete an entry
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entry deleted successfully
 *       404:
 *         description: Entry not found
 */
router.delete('/:id', entryController.deleteEntry);

module.exports = router;
