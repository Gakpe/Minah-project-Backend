const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  issuer: String,
  nationality: String,
  first_name: String,
  last_name: String,
  address: String,
  profilePicture: String,
  email: { type: String, unique: true }, 
  investor: Boolean,
  loginCount: Number,
  accountVerified: Boolean,
  totalAmountInvested: Number,
  amountInvested: [{ amount: String, timestamp: Date }],
  lastLoginAt: Date, 
});

module.exports = mongoose.model('User', userSchema);
