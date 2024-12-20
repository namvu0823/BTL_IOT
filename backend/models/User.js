const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  date_update: { type: String, required: true },
  UID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  finger: { type: Boolean, required: true }, // "bit" được ánh xạ thành Boolean
});

module.exports = mongoose.model('User', userSchema);
