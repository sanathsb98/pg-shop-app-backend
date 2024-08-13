const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('../db');
const userRoutes = require('../routes/userRoutes');

// Load the environment variables
dotenv.config();

const PORT = process.env.PORT || 2000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create the users table
db.createUserTable();

app.use('/users',userRoutes)

// Start the server
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is listening on port ${PORT}`);
    } else {
        console.error('Error starting server:', error);
    }
});

app.get('/api', (req, res) => {
    res.status(200).send('Server Is Listening');
});