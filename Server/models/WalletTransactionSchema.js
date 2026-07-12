const mongoose = require('mongoose');

const WalletTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit', 'withdrawal', 'refund'], required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  description: { type: String, default: '' },
  gst: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  invoiceNumber: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('WalletTransaction', WalletTransactionSchema);
