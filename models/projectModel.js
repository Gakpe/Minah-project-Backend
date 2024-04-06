const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  totalAmountInvested: Number,
  maxAmountReached: Boolean,
  associatedInvestor: Array,
  totalInvestors: Number,
  image:String,
  name:String,
  description:String,
});

module.exports = mongoose.model('Project', projectSchema);
