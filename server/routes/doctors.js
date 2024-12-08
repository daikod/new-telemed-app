const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const doctorController = require('../controllers/doctorController');

router.get('/', auth, doctorController.getAllDoctors);
router.get('/:id', auth, doctorController.getDoctorById);
router.get('/:id/availability', auth, doctorController.getDoctorAvailability);
router.post('/:id/schedule', auth, doctorController.updateSchedule);

module.exports = router; 