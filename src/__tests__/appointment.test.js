const request = require('supertest');
const app = require('../index');
const { pool } = require('../config/database');

describe('Appointment API', () => {
  const testServiceProvider = {
    name: 'Dr. Smith',
    email: 'dr.smith@example.com',
    phone: '123-456-7890'
  };

  let serviceProviderId;

  beforeAll(async () => {
    // Clean up the database before tests
    await pool.query('DELETE FROM appointments');
    await pool.query('DELETE FROM service_providers');
    // Create a service provider before each test
    const providerResponse = await request(app)
      .post('/api/service-providers')
      .send(testServiceProvider);
    serviceProviderId = providerResponse.body.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  const testAppointment = {
    startTime: '2024-03-20T10:00:00Z',
    duration: 60,
    serviceProviderId: null, // Will be set in beforeEach
    service: 'Dental Checkup'
  };

  let createdAppointmentId;

  test('should create a new appointment', async () => {
    const appointmentData = {
      ...testAppointment,
      serviceProviderId
    };

    const response = await request(app)
      .post('/api/appointments')
      .send(appointmentData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.service_provider_id).toBe(serviceProviderId);
    createdAppointmentId = response.body.id;
  });

  test('should get all appointments', async () => {
    const response = await request(app)
      .get('/api/appointments');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('provider_name');
    expect(response.body[0]).toHaveProperty('provider_email');
  });

  test('should get appointment by id', async () => {
    const response = await request(app)
      .get(`/api/appointments/${createdAppointmentId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdAppointmentId);
    expect(response.body.service_provider_id).toBe(serviceProviderId);
    expect(response.body.provider_name).toBe(testServiceProvider.name);
    expect(response.body.provider_email).toBe(testServiceProvider.email);
  });

  test('should delete appointment', async () => {
    const response = await request(app)
      .delete(`/api/appointments/${createdAppointmentId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Appointment deleted successfully');
  });

  test('should return 404 for non-existent appointment', async () => {
    const response = await request(app)
      .get('/api/appointments/99999');

    expect(response.status).toBe(404);
  });

  test('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('All fields are required');
  });
});