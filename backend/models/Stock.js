const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  symbol: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  priceHistory: [{
    price: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  volatility: { type: Number, default: 5 },
  supply: { type: Number, default: 1000 },
  totalTransactions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stock', stockSchema);
