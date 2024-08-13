const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// const pool = new Pool({
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     host: process.env.HOST,
//     port: process.env.DBPORT,
//     database: process.env.DATABASE,
// });

// for vercel database:

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })

// create a user table:
const createUserTable = async () => {
    const filePath = path.join(__dirname, 'tables', 'users.sql');
    // Read the SQL file asynchronously
    const sql = fs.readFileSync(filePath, 'utf8');
    try {
        await pool.query(sql);
        console.log('Users table created or already exists');
    } catch (error) {
        console.error('Cannot create user table:', error);
    }
};

// Export both the pool and the createUserTable function
module.exports = {
    pool,
    createUserTable
};



