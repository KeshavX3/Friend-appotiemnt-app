const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  requesterId: {
    type: String, // Store as string for consistency
    required: true,
  },
  approverId: {
    type: String, // Store as string for consistency
    required: true,
  },
  type: {
    type: String,
    enum: ['call', 'meeting', 'chat'],
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'delayed'],
    default: 'pending',
    required: true,
  },
  note: {
    type: String,
  },
  delayReason: {
    type: String,
  },
  newTime: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
