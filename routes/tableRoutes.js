const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// POST /api/tables/lock - Lock a table for reservation
router.post('/lock', tableController.lockTable);

// POST /api/tables/unlock - Unlock a table
router.post('/unlock', tableController.unlockTable);

// GET /api/tables/:tableId/status - Check table lock status
router.get('/:tableId/status', tableController.getTableStatus);

module.exports = router; 
