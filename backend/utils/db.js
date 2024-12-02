const mysql = require('mysql2/promise');
const dbConfig = require('../config/db_config');

const pool = mysql.createPool(dbConfig);

module.exports = pool;

