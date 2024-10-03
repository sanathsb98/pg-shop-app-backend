const cartModal = require("../models/carts")

const addItemToCart = async(req,res) => {
    const { user_id, product_id, order_quantity } = req.body;
    console.log(user_id,product_id,order_quantity)
    try{
    const cart = await cartModal.addToCart(user_id, product_id, order_quantity);
    res.status(200).json(cart)
    }catch(err){
        res.status(500).json({message:"cant add to cart"})
    }
}

const getCartItems = async(req,res) => {
  const {user_id} = req.body;
  try{
  const cartData = await cartModal.returnCartItems(user_id);
  res.status(200).json(cartData)
  }catch(err){
    return res.status(500).json({message:"cant get cart details"})
  }
}

module.exports = {
    addItemToCart,
    getCartItems
}

// {
//     "id": 7,
//     "product_name": "Aeria Comfy Shirt",
//     "product_des": "providing comfort fot your life",
//     "product_price": "699.00",
//     "stock_quantity": 10,
//     "product_image": "https://i.postimg.cc/0NG6YRcX/product1.png",
//     "created_at": "2024-09-23T01:54:24.666Z",
//     "updated_at": "2024-09-23T01:54:24.666Z"
//   },