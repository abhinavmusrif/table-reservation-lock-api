// In-memory storage for table locks
const tableLocks = new Map();

/**
 * Lock a table for reservation
 * POST /api/tables/lock
 */
const lockTable = (req, res) => {
  try {
    const { tableId, userId, duration } = req.body;

    // Validate required fields
    if (!tableId || !userId || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: tableId, userId, and duration are required'
      });
    }

    // Validate duration is a positive number
    if (typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be a positive number in seconds'
      });
    }

    // Check if table is already locked
    const existingLock = tableLocks.get(tableId);
    
    if (existingLock) {
      // Check if the existing lock has expired
      const now = Date.now();
      if (existingLock.expiryTimestamp > now) {
        return res.status(409).json({
          success: false,
          message: 'Table is currently locked by another user.'
        });
      } else {
        // Remove expired lock
        tableLocks.delete(tableId);
      }
    }

    // Create new lock
    const expiryTimestamp = Date.now() + (duration * 1000); // Convert seconds to milliseconds
    const lockRecord = {
      tableId,
      userId,
      expiryTimestamp,
      createdAt: Date.now()
    };

    tableLocks.set(tableId, lockRecord);

    res.status(200).json({
      success: true,
      message: 'Table locked successfully.'
    });

  } catch (error) {
    console.error('Error locking table:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Unlock a table
 * POST /api/tables/unlock
 */
const unlockTable = (req, res) => {
  try {
    const { tableId, userId } = req.body;

    // Validate required fields
    if (!tableId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: tableId and userId are required'
      });
    }

    // Check if table is locked
    const existingLock = tableLocks.get(tableId);
    
    if (!existingLock) {
      return res.status(404).json({
        success: false,
        message: 'Table is not currently locked'
      });
    }

    // Check if the lock has expired
    const now = Date.now();
    if (existingLock.expiryTimestamp <= now) {
      // Remove expired lock
      tableLocks.delete(tableId);
      return res.status(200).json({
        success: true,
        message: 'Table lock has expired and been removed'
      });
    }

    // Verify user owns the lock
    if (existingLock.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only unlock tables that you have locked'
      });
    }

    // Remove the lock
    tableLocks.delete(tableId);

    res.status(200).json({
      success: true,
      message: 'Table unlocked successfully'
    });

  } catch (error) {
    console.error('Error unlocking table:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get table lock status
 * GET /api/tables/:tableId/status
 */
const getTableStatus = (req, res) => {
  try {
    const { tableId } = req.params;

    if (!tableId) {
      return res.status(400).json({
        success: false,
        message: 'Table ID is required'
      });
    }

    const existingLock = tableLocks.get(tableId);
    
    if (!existingLock) {
      return res.status(200).json({
        isLocked: false
      });
    }

    // Check if lock has expired
    const now = Date.now();
    if (existingLock.expiryTimestamp <= now) {
      // Remove expired lock
      tableLocks.delete(tableId);
      return res.status(200).json({
        isLocked: false
      });
    }

    res.status(200).json({
      isLocked: true
    });

  } catch (error) {
    console.error('Error getting table status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  lockTable,
  unlockTable,
  getTableStatus
}; 
