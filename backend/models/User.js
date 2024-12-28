const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UID: { type: String, required: true, unique: true },
  avatar: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  finger: { type: String, default: null }, // Finger sẽ được thêm sau
  registration_status: { type: String, enum: ['Pending', 'Active'], default: 'Pending' }, // Đổi tên từ status thành registration_status
  date_create: { type: String, required: true },
  date_update: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
    