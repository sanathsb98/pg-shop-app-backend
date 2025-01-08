// paymentModel.js
const db = require('../db');

const updatePaymentInfo = async (user_id, order_id, txn_id, amount, status) => {
    try {
        const newPayment = await db.pool.query(
            "INSERT INTO payments (user_id, order_id, txn_id, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [user_id, order_id, txn_id, amount, status]
        );
        return newPayment.rows[0];
    } catch (error) {
        console.error("Error in updating payment info:", error);
        throw error;
    }
};

module.exports = {
    updatePaymentInfo,
};
