const db = require('../db');

const viewAllProducts = async () => {
    try {
        const products = await db.pool.query('SELECT * FROM products');
        return products.rows;
    } catch (err) {
        console.log('error in getting products', err);
        throw err;
    }
}

const viewLimitedProducts = async (limit, offset) => {
    try {
        const limitedProducts = await db.pool.query("SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2", [limit, offset]);
        return limitedProducts.rows
    } catch (err) {
        console.error("error in getting limited products")
        throw err;
    }
}

const addProduct = async (product_name, product_des, product_price, stock_quantity, product_image) => {
    try {
        const product = await db.pool.query('SELECT * FROM products WHERE product_name = $1', [product_name])
        if (product.rows.length > 0) {
           return ({error:"product already exists"})
        } else {
            const newProduct = await db.pool.query('INSERT INTO products (product_name, product_des, product_price, stock_quantity, product_image) VALUES($1,$2,$3,$4,$5) RETURNING *', [product_name, product_des, product_price, stock_quantity, product_image])
            return newProduct.rows[0];
        }
    } catch (error) {
        console.log('error in creating a product', error);
        throw error;
    }
}

module.exports = {
    viewAllProducts,
    addProduct,
    viewLimitedProducts
}