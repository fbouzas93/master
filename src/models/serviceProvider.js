const { pool } = require('../config/database');

class ServiceProvider {
  static async create({ name, email, phone }) {
    const query = `
      INSERT INTO service_providers (name, email, phone)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [name, email, phone];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM service_providers ORDER BY name';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM service_providers WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, { name, email, phone }) {
    const query = `
      UPDATE service_providers
      SET name = $1, email = $2, phone = $3
      WHERE id = $4
      RETURNING *
    `;
    const values = [name, email, phone, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM service_providers WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = ServiceProvider;