const mongoose = require('mongoose');

const fingerprintSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  fingerprintData: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Fingerprint', fingerprintSchema);
