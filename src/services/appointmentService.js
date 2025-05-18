const { pool } = require('../config/database');
const AllFieldsAreRequiredException = require('../exceptions/AllFieldsAreRequiredException');
const AppointmentConflictException = require('../exceptions/AppointmentConflictException');
const MaxRetriesExceededException = require('../exceptions/MaxRetriesExceededException');
const Appointment = require('../models/appointment');

class AppointmentService {
  async create({ startTime, duration, serviceProviderId, service }) {
    if (!startTime || !duration || !serviceProviderId || !service) {
      throw new AllFieldsAreRequiredException();
    }

    const client = await pool.connect();
    const maxRetries = 3;

    try {
      let attempt = 0;

      while (attempt < maxRetries) {
        attempt++;
        try {
          await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE');

          const hasConflict = await Appointment.hasConflict({ startTime, duration, serviceProviderId }, client);

          if (hasConflict) {
            throw new AppointmentConflictException();
          }

          const appointment = await Appointment.create({ startTime, duration, serviceProviderId, service }, client);

          await client.query('COMMIT');
          return appointment;

        } catch (err) {
          await client.query('ROLLBACK');

          if (err.code === '40001' && attempt < maxRetries) {
            // console.warn(`Serializable conflict attempt: ${attempt}`);
            await new Promise(resolve => setTimeout(resolve, 100));
            // Retry on serialization failure
            continue;
          }

          throw err;
        }
      }

      throw new MaxRetriesExceededException();
    } finally {
      client.release();
    }
  }
}

module.exports = new AppointmentService();