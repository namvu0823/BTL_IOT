const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  id_port: { type: String, required: true },
  UID: { type: String, required: true }, 
  finger:{type: String, required: true},
  // access_type:{type: String, enum:['RFID','Fingerprint'], require: true},
  time_in: { type: String, required: true},
  status: { type: Boolean, required: true },
} ,  {timestamps: true});

module.exports = mongoose.model('History', historySchema);
