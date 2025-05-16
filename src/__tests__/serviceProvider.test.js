const request = require('supertest');
const app = require('../index');
const { pool } = require('../config/database');

describe('Service Provider API', () => {
  const testServiceProvider = {
    name: 'Dr. Smith',
    email: 'dr.smith@example.com',
    phone: '123-456-7890'
  };

  let createdServiceProviderId;

  beforeAll(async () => {
    // Clean up the database before tests
    await pool.query('DELETE FROM appointments');
    await pool.query('DELETE FROM service_providers');
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should create a new service provider', async () => {
    const response = await request(app)
      .post('/api/service-providers')
      .send(testServiceProvider);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(testServiceProvider.name);
    expect(response.body.email).toBe(testServiceProvider.email);
    expect(response.body.phone).toBe(testServiceProvider.phone);
    createdServiceProviderId = response.body.id;
  });

  test('should not create service provider with missing required fields', async () => {
    const response = await request(app)
      .post('/api/service-providers')
      .send({ name: 'Dr. Jones' }); // Missing email

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Name and email are required');
  });

  test('should not create service provider with duplicate email', async () => {
    const response = await request(app)
      .post('/api/service-providers')
      .send(testServiceProvider);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Email already exists');
  });

  test('should get all service providers', async () => {
    const response = await request(app)
      .get('/api/service-providers');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('email');
  });

  test('should get service provider by id', async () => {
    const response = await request(app)
      .get(`/api/service-providers/${createdServiceProviderId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdServiceProviderId);
    expect(response.body.name).toBe(testServiceProvider.name);
    expect(response.body.email).toBe(testServiceProvider.email);
    expect(response.body.phone).toBe(testServiceProvider.phone);
  });

  test('should return 404 for non-existent service provider', async () => {
    const response = await request(app)
      .get('/api/service-providers/99999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Service provider not found');
  });

  test('should update service provider', async () => {
    const updatedData = {
      name: 'Dr. Smith Updated',
      email: 'dr.smith.updated@example.com',
      phone: '987-654-3210'
    };

    const response = await request(app)
      .put(`/api/service-providers/${createdServiceProviderId}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdServiceProviderId);
    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.email).toBe(updatedData.email);
    expect(response.body.phone).toBe(updatedData.phone);
  });

  test('should not update service provider with duplicate email', async () => {
    // First create another service provider
    const anotherProvider = {
      name: 'Dr. Jones',
      email: 'dr.jones@example.com',
      phone: '555-555-5555'
    };

    await request(app)
      .post('/api/service-providers')
      .send(anotherProvider);

    // Try to update first provider with second provider's email
    const response = await request(app)
      .put(`/api/service-providers/${createdServiceProviderId}`)
      .send({ ...testServiceProvider, email: anotherProvider.email });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Email already exists');
  });

  test('should delete service provider', async () => {
    const response = await request(app)
      .delete(`/api/service-providers/${createdServiceProviderId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Service provider deleted successfully');
  });

  test('should return 404 when deleting non-existent service provider', async () => {
    const response = await request(app)
      .delete('/api/service-providers/99999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Service provider not found');
  });
});
