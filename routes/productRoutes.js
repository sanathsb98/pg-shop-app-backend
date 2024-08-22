const express = require('express');
const router = express.Router()
const productsControl = require('../controllers/productsControl')

router.get('/allProducts',productsControl.getAllProducts)
router.get('/limitProducts',productsControl.getLimitProducts)
router.post('/addProduct',productsControl.addNewProduct)

module.exports = router;