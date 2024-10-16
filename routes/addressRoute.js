const express = require("express")
const router = express.Router()
const address = require("../controllers/addressControl")

router.post("/addDeliveryAddress",address.addDeliveryAddress)
router.post("/getDeliveryAddress",address.fetchDeliveryAddress)
router.post("/removeDeliveryAddress",address.removeDeliveryAddress)

module.exports = router;