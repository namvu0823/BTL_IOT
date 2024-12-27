const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UID: { type: String, required: true, unique: true },
  avatar: { type: String, required: true},
  date_create: { type: String, required: true},
  date_update: { type: String, required: true},
  name: { type: String, required: true },
  email: { type: String, required: true },
  finger: { type: String, required: true }, 
});

module.exports = mongoose.model('User', userSchema);
    