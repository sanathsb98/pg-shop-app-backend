const { json } = require("express");
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

    // Check if the product already exists in the user's cart
    const isProductExists = await db.pool.query(
      "SELECT * FROM cartItems WHERE cart_id = $1 AND product_id = $2",
      [cart.cart_id, product_id]
    );

    if (isProductExists.rows.length === 0) {
      // Insert the new product into the cart
      const cartItem = await db.pool.query(
        "INSERT INTO cartItems (cart_id, product_id, order_quantity) VALUES ($1, $2, $3) RETURNING *",
        [cart.cart_id, product_id, order_quantity]
      );
      return cartItem.rows[0];
    } else {
      // Update the existing product quantity in the cart
      const updatedCart = await db.pool.query(
        "UPDATE cartItems SET order_quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *",
        [order_quantity, cart.cart_id, product_id]
      );
      return updatedCart.rows[0];
    }

  } catch (error) {
    console.error("Cannot add product to cart", error);
    throw error; // Optionally re-throw the error for higher-level handling
  }
};

const returnCartItems = async(user_id) => {
  try{
  const userCartData =  await db.pool.query(
         `SELECT 
          cartItems.cartItem_id,
          cartItems.cart_id,
          cartItems.product_id,
          products.product_name AS product_name,
          products.product_price AS product_price,
          products.product_des AS product_des,
          products.product_image AS product_image,
          cartItems.order_quantity,
          cartItems.added_at,
          carts.created_at AS cart_created_at
      FROM 
          cartItems
      JOIN 
          products ON cartItems.product_id = products.id
      JOIN 
          carts ON cartItems.cart_id = carts.cart_id
      WHERE 
          carts.user_id = $1
          ORDER BY
          cartItems.added_at DESC;`,
          [user_id]);
          return userCartData.rows;
  }catch(error){
    console.log("can't get cart items",error);
    throw error;
  }
}

const updateProductQuantity = async (product_quantity, product_id) => {
  try {
    const updatedQuantity = await db.pool.query("UPDATE cartItems SET order_quantity = $1 WHERE  product_id = $2 RETURNING *", [product_quantity, product_id]);
    return updatedQuantity.rows[0]
  } catch (error) {
    console.log("error in updating product quantity", error);
    throw error;
  }
}

const removeFromCart = async (product_id) => {
  try {
    const product = await db.pool.query("SELECT * FROM cartItems WHERE product_id = $1", [product_id]);
    if (product.rows.length > 0) {
      // Delete the product if it exists
      await db.pool.query("DELETE FROM cartItems WHERE product_id = $1", [product_id]);
      return { message: "Product successfully removed from cart" };
    } else {
      return { message: "Invalid product id" };
    }
  } catch (error) {
    console.log("Error in removing the cart item", error);
    throw error;
  }
};


module.exports = {
  addToCart,
  returnCartItems,
  updateProductQuantity,
  removeFromCart,
}


