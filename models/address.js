const db = require("../db")

const addDeliveryAddress = async(name,user_id,phone,zipcode,locality,deladdress,city,state,landmark,alternatephone) => {
    try{
      const address = await db.pool.query("INSERT INTO address (user_id,phone,zipcode,locality,address,city,state,landmark,alternatephone,name) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
            [user_id,phone,zipcode,locality,deladdress,city,state,landmark,alternatephone,name]
        )
        return address.rows[0]
    }catch(error){
        console.log("cannot add delivery address",error)
        throw error
    }
}

const getDeliveryAddress = async (user_id) => {
    try {
        const address = await db.pool.query(
            "SELECT address.id as address_id, users.id as user_id, address.name, users.email, address.phone, address.zipcode, address.locality, address.address, address.city, address.state, address.landmark, address.alternatephone FROM address JOIN users ON address.user_id = users.id WHERE users.id = $1", [user_id])
        return address.rows
    } catch (error) {
        console.log("cannot get delivery address", error)
        throw error
    }
}

const deleteDeliveryAddress = async(user_id,address_id) => {
    try{
      await db.pool.query("DELETE FROM address WHERE id = $1 AND user_id = $2",[address_id,user_id])
    }catch(error){
        console.log("cannot delete delivery address",error)
        throw error
    }
}

module.exports = {
    addDeliveryAddress,
    getDeliveryAddress,
    deleteDeliveryAddress
}