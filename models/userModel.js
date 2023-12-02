const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  issuer: String,
  email: String,
  lastLoginAt: Number,
  appleCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
