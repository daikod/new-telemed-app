const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const hospitalController = require('../controllers/hospitalController');

router.get('/', auth, hospitalController.getAllHospitals);
router.get('/:id', auth, hospitalController.getHospitalById);
router.get('/:id/doctors', auth, hospitalController.getHospitalDoctors);
router.get('/:id/departments', auth, hospitalController.getHospitalDepartments);

module.exports = router; 