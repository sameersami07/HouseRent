const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  renterDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    occupation: { type: String },
    notes: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
