const mongoose = require('mongoose');

console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
});

module.exports = mongoose.connection;
