const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

// Get all appointments for a user
router.get('/', auth, appointmentController.getUserAppointments);

// Get available slots for a doctor
router.get('/available-slots', auth, appointmentController.getAvailableSlots);

// Schedule new appointment
router.post('/', auth, appointmentController.createAppointment);

// Update appointment status
router.patch('/:id', auth, appointmentController.updateAppointment);

// Cancel appointment
router.delete('/:id', auth, appointmentController.cancelAppointment);

module.exports = router; 