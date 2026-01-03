const express = require('express');
const router = express.Router();
const { entryController } = require('../controllers');
const { authenticate } = require('../middleware');
const { entryValidation } = require('../validators');

// Tất cả routes đều cần authentication
router.use(authenticate);

// Routes
router.post('/', entryValidation.createOrUpdate, entryController.createOrUpdateEntry);
router.get('/today', entryController.getTodayEntry);
router.get('/range', entryController.getEntriesByRange);
router.get('/:id', entryController.getEntryById);
router.get('/', entryValidation.getByMonth, entryController.getEntries);
router.delete('/:id', entryController.deleteEntry);

module.exports = router;
