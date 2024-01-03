const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  issuer: String,
  first_name: String,
  last_name: String,
  address: String,
  image: Object,
  email: String,
  lastLoginAt: Number,
  appleCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
