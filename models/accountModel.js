const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  name: String,
  hiddenOnUI: Boolean,
  customerRefId: String,
  autoFuel: Boolean,
});

module.exports = mongoose.model('Account', accountSchema);
