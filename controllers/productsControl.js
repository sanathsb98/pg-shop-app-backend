const productModel = require('../models/products')

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.viewAllProducts();
        return res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ message: 'error in getting products' })
    }
}

const getLimitProducts = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10

    console.log("page",page)
    console.log("limit",limit)
    const offset = (page - 1) * limit;
    try {
        const limitedProducts = await productModel.viewLimitedProducts(limit, offset);
        return res.status(200).json(limitedProducts)
    } catch (err) {
        res.status(500).json({ message: 'error in fetching limited data' })
    }
}

const addNewProduct = async (req, res) => {
    const { product_name, product_des, product_price, stock_quantity, product_image } = req.body
    try {
        const newProduct = await productModel.addProduct(product_name, product_des, product_price, stock_quantity, product_image);
        return res.status(200).json(newProduct)
    } catch (err) {
        res.status(500).json({ message: 'cant add new product' })
    }
}

module.exports = {
   getAllProducts,
   addNewProduct,
   getLimitProducts
}