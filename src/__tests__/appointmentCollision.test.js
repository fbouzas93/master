const request = require('supertest');
const app = require('../index');
const { pool } = require('../config/database');

describe('Appointment collision Test', () => {
  let defaultAppointment;

  beforeAll(async () => {
    await pool.query('DELETE FROM appointments');
    await pool.query('DELETE FROM service_providers');

    const providerResponse = await request(app)
      .post('/api/service-providers')
      .send({
        name: 'Dr. Smith',
        email: 'dr.smith@example.com',
        phone: '123-456-7890'
      });

    defaultAppointment = {
      startTime: '2024-03-20T10:00:00Z',
      duration: 60,
      service: 'Dental Checkup',
      serviceProviderId: providerResponse.body.id
    };
  });

  beforeEach(async () => {
    await pool.query('DELETE FROM appointments');
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should not allow appointment collision', async () => {
    await createAppointment();

    const response = await request(app)
      .post('/api/appointments')
      .send(defaultAppointment);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('The appointment slot isnt available at that time.');
  });

  test('should not allow appointment collision before', async () => {
    //given an existing appoint halfhour before
    await createAppointment({ startTime: '2024-03-20T9:30:00Z' });

    //when i try to schedule a new appointment..
    const response = await request(app)
      .post('/api/appointments')
      .send(defaultAppointment);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('The appointment slot isnt available at that time.');
  });

  test('should not allow appointment collision after', async () => {
    //given that i have an existing appointment in the db half hour later.
    await createAppointment({ startTime: '2024-03-20T10:30:00Z' });

    const response = await request(app)
      .post('/api/appointments')
      .send(defaultAppointment);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('The appointment slot isnt available at that time.');
  });

  test('should handle high concurrency gracefully', async () => {
    const promises = Array(5).fill(null).map(() =>
      request(app).post('/api/appointments').send(defaultAppointment)
    );

    const results = await Promise.all(promises);

    const successCount = results.filter(r => r.status === 201).length;
    const conflictCount = results.filter(r => r.status === 409).length;

    expect(successCount + conflictCount).toBe(5);
  });

  async function createAppointment(overrides = {}) {
    const data = { ...defaultAppointment, ...overrides };

    await pool.query(
      'INSERT INTO appointments (start_time, duration, service, service_provider_id) VALUES ($1, $2, $3, $4)',
      [data.startTime, data.duration, data.service, data.serviceProviderId]
    );
  }
});