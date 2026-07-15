const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  reply: { type: String, default: '' },
  reported: { type: Boolean, default: false },
  reportReason: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
