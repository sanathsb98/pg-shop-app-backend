const userModal = require('../models/users')

const getFullUsers = async (req, res) => {
    try {
        const users = await userModal.getAllUsers();
        res.status(200).json(users)
    }
    catch (error) {
        res.status(500).json({ message: 'error getting users' })
    }
}

const createNewUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = await userModal.createUser(name, email, password);
        res.status(200).json(newUser)
    } catch (error) {
        res.status(500).json({ message: 'cant create a new user' })
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try{
      const loggedUser = await userModal.userLogin(email,password)
      res.status(200).json(loggedUser)
    }catch(error){
        res.status(500).json({message : 'cant login'})
    }
}

const resetPassword = async(req,res) => {
    const {email, password} = req.body;
    try{
    const resetData = await userModal.resetPassword(email,password)
    res.status(200).json({message : "recovery mail send to your registered email"})
    }catch(error){
        res.status(500).json({message : 'cant reset password'})
    }
}

const verifyResetPassToken = async(req,res) => {
  const {token} = req.query;
  console.log("token",token)
  try{
 
  const email = await userModal.verifyResetToken(token);
  res.redirect(`/users/updatePassword?token=${token}`)
  }catch(error){
    res.status(500).json({message:'Invalid or expired reset token'})
  }
}

const updateUserPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
       const result = await userModal.updatePassword(token, newPassword);
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: 'Error Updating Password' })
    }
}

module.exports = {
    getFullUsers,
    createNewUser,
    loginUser,
    resetPassword,
    verifyResetPassToken,
    updateUserPassword
};