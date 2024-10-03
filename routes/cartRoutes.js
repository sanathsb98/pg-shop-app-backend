const express = require("express")
const router = express.Router();
const cart = require("../controllers/cartControl");

router.post("/addToCart",cart.addItemToCart)

module.exports = router;