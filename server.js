const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const tableRoutes = require('./routes/tableRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tables', tableRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Table Reservation Lock API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Table Reservation Lock API running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/health`);
});

module.exports = app; 