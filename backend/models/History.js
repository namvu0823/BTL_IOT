const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  id_port: { type: String, required: true },
  UID: { type: mongoose.Schema.Types.String, required: true, ref: 'User' }, 
  finger:{Type: mongoose.Schema.Types.String, required: false, ref: 'User'},
  time_in: { type: String, required: true },
  time_out: { type: String, required: true },
  status: { type: Boolean, required: true },
});

module.exports = mongoose.model('History', historySchema);
