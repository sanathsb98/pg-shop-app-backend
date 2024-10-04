const express = require("express")
const router = express.Router();
const cart = require("../controllers/cartControl");

router.post("/addToCart",cart.addItemToCart)
router.post("/getCartItems",cart.getCartItems)
router.post("/updateProductQuantity",cart.updateProductQuantity)

module.exports = router;