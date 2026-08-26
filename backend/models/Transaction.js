const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  stockId: mongoose.Schema.Types.ObjectId,
  type: { type: String, enum: ['buy', 'sell', 'create'] },
  quantity: Number,
  price: Number,
  totalAmount: Number,
  resultAmount: { type: Number, default: 0 },
  success: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'completed', 'failed'] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
