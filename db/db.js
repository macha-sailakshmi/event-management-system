const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

console.log('Attempting to connect to MySQL...');

promisePool.query("SELECT 1")
    .then(() => console.log('✅ MySQL Connected Successfully!'))
    .catch(err => {
        console.error('❌ Database Connection Failed:');
        console.error(err.message);
    });

module.exports = promisePool;
