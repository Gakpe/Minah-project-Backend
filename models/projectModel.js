const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  totalAmountInvested: Number,
  maxAmountReached: Boolean,
  associatedInvestor: Array,
  totalInvestors: Number
});

module.exports = mongoose.model('Project', projectSchema);
