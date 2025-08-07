const mysql = require('mysql2');

// Create a connection pool (recommended for better performance)
const pool = mysql.createPool({
  host: 'localhost',       // your MySQL host (usually localhost)
  user: 'root', // your MySQL username
  password: '', // your MySQL password
  database: 'ecommerce', // your database name
    charset: 'utf8mb4'  // <-- add this line to support emojis
});

// Export the pool promise-based API for async/await usage
const promisePool = pool.promise();

module.exports = promisePool;