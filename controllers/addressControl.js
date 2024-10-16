const addressModal = require("../models/address")

const addDeliveryAddress = async (req, res) => {
    const { user_id, phone, zipcode, locality, deladdress, city, state, landmark, alternatephone } = req.body;
    console.log(user_id, phone, zipcode, locality, deladdress, city, state, landmark, alternatephone)
    try {
        const data = await addressModal.addDeliveryAddress(user_id, phone, zipcode, locality, deladdress, city, state, landmark, alternatephone)
        console.log(data)
        res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ message: "cant add delivery address" })
    }
}

const fetchDeliveryAddress = async(req,res) => {
    const {user_id} = req.body;
    try{
      const data = await addressModal.getDeliveryAddress(user_id)
      console.log(data)
      res.status(200).json(data)
    }catch(error){
        return res.status(500).json({message:"cant get delivery address"})
    }
}

const removeDeliveryAddress = async(req,res) => {
    const {user_id,address_id} = req.body;
    try{
      const data = await addressModal.deleteDeliveryAddress(user_id,address_id)
      console.log(data)
      res.status(200).json(data)
    }catch(error){
        return res.status(500).json({message:"cant delete delivery address"})
    }
}

module.exports = {
    addDeliveryAddress,
    fetchDeliveryAddress,
    removeDeliveryAddress
}