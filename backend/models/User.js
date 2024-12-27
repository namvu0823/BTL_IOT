const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UID: { type: String, required: true, unique: true },
  avatar: { type: String},
  date_create: { type: String, required: true},
  date_update: { type: String, required: true},
  name: { type: String, required: true },
  email: { type: String, required: true },
  finger: { type: String, required: true }, 
  status: { type: String, enum: ['in', 'out'], default: 'out' },  // Trạng thái người dùng
});

module.exports = mongoose.model('User', userSchema);
    