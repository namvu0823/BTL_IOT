const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  id_port: { type: String, required: true, unique: true },
  UID: { type: mongoose.Schema.Types.String, required: true, ref: 'User' }, // Tham chiếu UID của User
});

module.exports = mongoose.model('Device', deviceSchema);
