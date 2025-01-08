
// paymentController.js
const paymentModel = require("../models/payment");  // Corrected path to the model file if needed
const paytmChecksum = require('paytmchecksum');

const initiatePayment = async (req, res) => {

    const { amount, userId } = req.body;
    const orderId = `ORDER_${Date.now()}`;  // Using Date.now() for uniqueness

    const paytmParams = {
        MID: process.env.PAYTM_MID,
        WEBSITE: process.env.PAYTM_WEBSITE,
        INDUSTRY_TYPE_ID: 'Retail',
        CHANNEL_ID: 'WEB',
        ORDER_ID: orderId,
        CUST_ID: userId,
        TXN_AMOUNT: amount.toString(),
        CALLBACK_URL: `${process.env.BASE_URL}/api/paytm/callback`,  // Use an environment variable for the base URL
    };

    try {
        const checksum = await paytmChecksum.generateSignature(paytmParams, process.env.PAYTM_MERCHANT_KEY);
        res.json({ paytmParams, checksum });
    } catch (error) {
        console.error("Error generating checksum:", error);
        res.status(500).json({ error: 'Error generating checksum' });
    }

};

const verifyPayment = async (req, res) => {
    const { ORDERID, TXNID, TXNAMOUNT, STATUS, CHECKSUMHASH, CUST_ID } = req.body;
    const paytmParams = req.body;

    // Verify the checksum sent by Paytm
    const isValidChecksum = paytmChecksum.verifySignature(paytmParams, process.env.PAYTM_MERCHANT_KEY, CHECKSUMHASH);
    if (isValidChecksum) {
        try {
            const status = STATUS === 'TXN_SUCCESS' ? 'Completed' : 'Failed';
            const paymentInfo = await paymentModel.updatePaymentInfo(CUST_ID, ORDERID, TXNID, TXNAMOUNT, status);
            res.status(200).json({ message: 'Payment status updated successfully', paymentInfo });
        } catch (error) {
            console.error("Error updating payment status:", error);
            res.status(500).json({ error: 'Error updating payment status' });
        }
    } else {
        res.status(400).json({ error: 'Checksum mismatch' });
    }
};

module.exports = {
    initiatePayment,
    verifyPayment,
};
