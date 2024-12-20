const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UID: { type: String, required: true, unique: true },
  date_update: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  finger: { type: Boolean, required: true }, // "bit" được ánh xạ thành Boolean
});

module.exports = mongoose.model('User', userSchema);
    