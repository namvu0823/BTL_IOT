const mongoose = require('mongoose');

const rfidSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cardUID: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('RFID', rfidSchema);
