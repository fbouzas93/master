const ServiceProvider = require('../models/serviceProvider');

const serviceProviderController = {
  async create(req, res) {
    try {
      const { name, email, phone } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const serviceProvider = await ServiceProvider.create({
        name,
        email,
        phone
      });

      res.status(201).json(serviceProvider);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const serviceProviders = await ServiceProvider.findAll();
      res.json(serviceProviders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const serviceProvider = await ServiceProvider.findById(req.params.id);
      if (!serviceProvider) {
        return res.status(404).json({ error: 'Service provider not found' });
      }
      res.json(serviceProvider);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { name, email, phone } = req.body;
      const serviceProvider = await ServiceProvider.update(req.params.id, {
        name,
        email,
        phone
      });
      if (!serviceProvider) {
        return res.status(404).json({ error: 'Service provider not found' });
      }
      res.json(serviceProvider);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const serviceProvider = await ServiceProvider.delete(req.params.id);
      if (!serviceProvider) {
        return res.status(404).json({ error: 'Service provider not found' });
      }
      res.json({ message: 'Service provider deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = serviceProviderController;