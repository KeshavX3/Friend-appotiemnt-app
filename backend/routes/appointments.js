const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createAppointment,
  getAppointments,
  updateAppointment
} = require('../controllers/appointmentController');

router.post('/', auth, createAppointment);
router.get('/', auth, getAppointments);
router.patch('/:id', auth, updateAppointment);

module.exports = router;