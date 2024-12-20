const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  id_port: { type: String, required: true, unique: true },
  location: {type: String}
});

module.exports = mongoose.model('Device', deviceSchema);
