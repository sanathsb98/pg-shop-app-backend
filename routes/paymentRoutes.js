// paymentRoutes.js
const express = require('express');
const { initiatePayment, verifyPayment } = require('../controllers/paymentControl');
const router = express.Router();

// Route to initiate payment
router.post('/paytm/initiate', initiatePayment);

// Callback route for Paytm to verify payment
router.post('/paytm/callback', verifyPayment);

module.exports = router;
