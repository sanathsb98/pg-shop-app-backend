const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('../db');
const userRoutes = require('../routes/userRoutes');
const productRoutes = require('../routes/productRoutes')
const cartRoutes = require("../routes/cartRoutes")
const addressRoutes = require("../routes/addressRoute")
const paymentRoutes = require("../routes/paymentRoutes")


// Load the environment variables
dotenv.config();

const PORT = process.env.PORT || 2000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create the users table
db.createUserTable();
db.createProductsTable();
db.createCartsTable();
db.createCartItemsTable();
db.createAddressTable();
db.createPaymentsTable();

app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes)
app.use("/address", addressRoutes)
app.use("/payment", paymentRoutes)

// Start the server
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is listening on port ${PORT}`);
    } else {
        console.error('Error starting server:', error);
    }
});

app.get('/', (req, res) => {
    res.status(200).send('Server Is Listening');
});