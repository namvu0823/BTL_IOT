const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Không cần useNewUrlParser và useUnifiedTopology
    console.log('Kết nối MongoDB thành công!');
  } catch (error) {
    console.error('Kết nối MongoDB thất bại:', error.message);
    process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
  }
};

module.exports = connectDB;
