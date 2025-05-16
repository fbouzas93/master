require('dotenv').config();
const express = require('express');
const appointmentRoutes = require('./routes/appointmentRoutes');
const serviceProviderRoutes = require('./routes/serviceProviderRoutes');
const { testConnection } = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/appointments', appointmentRoutes);
app.use('/api/service-providers', serviceProviderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Test database connection before starting the server
async function startServer() {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('Failed to connect to the database. Please check your database configuration.');
    process.exit(1);
  }

  if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

startServer();

module.exports = app; // Export for testing