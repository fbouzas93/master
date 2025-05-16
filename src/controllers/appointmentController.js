const Appointment = require('../models/appointment');

const appointmentController = {
  async create(req, res) {
    try {
      const { startTime, duration, serviceProviderId, service } = req.body;

      if (!startTime || !duration || !serviceProviderId || !service) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const appointment = await Appointment.create({
        startTime,
        duration,
        serviceProviderId,
        service
      });

      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const appointments = await Appointment.findAll();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const appointment = await Appointment.delete(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = appointmentController;