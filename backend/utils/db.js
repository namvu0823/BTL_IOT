// const mysql = require('mysql2/promise');
// const dbConfig = require('../config/db_config');

// const pool = mysql.createPool(dbConfig);

// module.exports = pool;

const mongoose = require('mongoose')
require('dotenv').config(); 
const MONGO_URI = "mongodb+srv://BTL-IOT:PT7IHvzxTlwuIEYA@cluster0.5xqet.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Kết nối MongoDB thành công!');
  } catch (error) {
    console.error('Kết nối MongoDB thất bại:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
