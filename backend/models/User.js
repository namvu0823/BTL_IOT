const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UID: { type: String, required: true, unique: true },
  date_create: { type: Date, required: true , default: Date.now },
  date_update: { type: Date, required: true , default: Date.now },
  name: { type: String, required: true },
  email: { type: String, required: true },
  finger: { type: String, required: true }, 
});

module.exports = mongoose.model('User', userSchema);
    