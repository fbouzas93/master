const Appointment = require('../models/appointment');
const appointmentService = require('../services/appointmentService');

const appointmentController = {
  async create(req, res) {
    try {
      const appointment = await appointmentService.create(req.body);
      return res.status(201).json(appointment);
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message });
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