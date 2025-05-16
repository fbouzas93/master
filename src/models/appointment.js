const { pool } = require('../config/database');

class Appointment {
  static async create({ startTime, duration, serviceProviderId, service }) {
    const query = `
      INSERT INTO appointments (start_time, duration, service_provider_id, service)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [startTime, duration, serviceProviderId, service];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findAll() {
    const query = `
      SELECT a.*, sp.name as provider_name, sp.email as provider_email
      FROM appointments a
      JOIN service_providers sp ON a.service_provider_id = sp.id
      ORDER BY a.start_time
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT a.*, sp.name as provider_name, sp.email as provider_email
      FROM appointments a
      JOIN service_providers sp ON a.service_provider_id = sp.id
      WHERE a.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM appointments WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Appointment;