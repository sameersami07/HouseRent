const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  type: { type: String, enum: ['Banner', 'Popup', 'Email', 'Push', 'SMS'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  scheduledFor: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
