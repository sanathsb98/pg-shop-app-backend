const db = require("../db");

const addToCart = async (user_id, product_id, order_quantity) => {
  try {
    // Check if user exists
    const user = await db.pool.query("SELECT * FROM users WHERE id = $1", [user_id]);
    if (user.rows.length === 0) {
      return { message: "No user found" };
    }

    // Check if the user has an existing cart
    let cart = await db.pool.query("SELECT * FROM carts WHERE user_id = $1", [user_id]);

    if (cart.rows.length === 0) {
      // Create a new cart if one doesn't exist
      const newCart = await db.pool.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
        [user_id]
      );
      cart = newCart.rows[0];
    } else {
      cart = cart.rows[0];
    }

    // Check if the product alreday exists in cart
      const isProductExists = await db.pool.query("SELECT * FROM cartItems WHERE product_id = $1", [product_id]);
      if (isProductExists.rows.length === 0) {
          const cartItem = await db.pool.query(
              "INSERT INTO cartItems (cart_id, product_id, order_quantity) VALUES ($1, $2, $3) RETURNING *",
              [cart.cart_id, product_id, order_quantity]
          );
          return cartItem.rows[0];
      } else {
          return { message: "product already exists in cart" }
      }

  
  } catch (error) {
    console.error("Cannot add product to cart", error);
    throw error; // Optionally re-throw the error for higher-level handling
  }
};


module.exports = {addToCart}


