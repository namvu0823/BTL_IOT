const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  id_port: { type: String, required: true },
  UID: { type: mongoose.Schema.Types.ObjectId,required: true, unique: true , ref: 'User' }, // userId với mã rfid là một 
  finger:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  access_type:{type: String, enum:['RFID','Fingerprint'], require: true},
  time_in: { type: Date, required: true , default: Date.now },
  // status: { type: Boolean, required: true },
} ,  {timestamps: true});

module.exports = mongoose.model('History', historySchema);
