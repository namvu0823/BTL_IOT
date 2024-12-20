const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  id_port: { type: String, required: true },
  UID: { type: mongoose.Schema.Types.String, required: true, ref: 'User' }, // Tham chiếu UID của User
  time_in: { type: String, required: true },
  time_out: { type: String, required: true },
  status: { type: Boolean, required: true },
});

module.exports = mongoose.model('History', historySchema);
