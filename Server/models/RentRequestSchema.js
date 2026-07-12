const mongoose = require('mongoose');

const RentRequestSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proposedRent: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Viewed', 'Accepted', 'Rejected', 'Negotiating', 'Visit Scheduled', 'Agreement Pending', 'Payment Pending', 'Completed', 'Cancelled'], default: 'Pending' },
  preferredMoveInDate: { type: Date },
  familySize: { type: Number, default: 1 },
  occupation: { type: String },
  monthlyIncome: { type: Number },
  rentalDuration: { type: Number, default: 12 },
  additionalNotes: { type: String },
  distanceFromProperty: { type: Number, default: 0 },
  travelTime: { type: String, default: '' },
  counterOfferBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  counterOfferAmount: { type: Number },
  agreementText: { type: String, default: '' },
  paymentDetails: {
    rentPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    amountPaid: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('RentRequest', RentRequestSchema);
