const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  rentAmount: { type: Number, required: true },
  propertyType: { type: String, required: true }, // e.g. Apartment, House, Room, etc.
  furnishingStatus: { type: String, enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'], default: 'Unfurnished' },
  amenities: [{ type: String }],
  images: [{ type: String }],
  status: { type: String, enum: ['Available', 'Booked'], default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
