const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cash: { type: Number, default: 1000000 },
  portfolio: [{
    stockId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    buyPrice: Number
  }],
  totalAssets: { type: Number, default: 1000000 },
  rank: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
