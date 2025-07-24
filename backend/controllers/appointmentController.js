const Appointment = require('../models/Appointment');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { approverId, type, startTime, endTime, note } = req.body;
    if (!approverId || !type || !startTime || !endTime) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }
    const appointment = await Appointment.create({
      requesterId: req.user.id.toString(),
      approverId: approverId.toString(),
      type,
      startTime,
      endTime,
      note,
      status: 'pending',
    });
    // Email notification to approver
    const approver = await User.findById(approverId);
    if (approver) {
      sendEmail(
        approver.email,
        'New Appointment Request',
        `You have a new appointment request from ${req.user.id}.`,
        `<p>You have a new appointment request.<br>Type: <b>${type}</b><br>Time: ${new Date(startTime).toLocaleString()}<br>Note: ${note || ''}</p>`
      ).catch(() => {});
    }
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all appointments for the logged-in user (as requester or approver)
exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.id.toString();
    const appointments = await Appointment.find({
      $or: [
        { requesterId: userId },
        { approverId: userId }
      ]
    }).sort({ startTime: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update appointment status (approve, reject, delay)
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, delayReason, newTime } = req.body;
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
    // Only approver can update
    if (appointment.approverId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    if (!['approved', 'rejected', 'delayed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    appointment.status = status;
    if (status === 'delayed') {
      appointment.delayReason = delayReason;
      appointment.newTime = newTime;
    }
    await appointment.save();
    // Email notification to requester
    const requester = await User.findById(appointment.requesterId);
    if (requester) {
      let subject = 'Appointment Update';
      let html = `<p>Your appointment has been <b>${status}</b>.</p>`;
      if (status === 'delayed') {
        html += `<p>Reason: ${delayReason}<br>New Time: ${new Date(newTime).toLocaleString()}</p>`;
      }
      sendEmail(
        requester.email,
        subject,
        `Your appointment has been ${status}.`,
        html
      ).catch(() => {});
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
