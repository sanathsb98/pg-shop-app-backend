const express = require('express');
const router = express.Router();
const userControl = require('../controllers/userControl');

router.get('/allUsers',userControl.getFullUsers)
router.post('/signUp',userControl.createNewUser)
router.post('/logIn',userControl.loginUser)
router.post('/resetPassword',userControl.resetPassword)
router.post('/verifyResetToken',userControl.verifyResetPassToken)
router.post('/updatePassword',userControl.updateUserPassword)
router.post('/verifyUserToken',userControl.verifyUserTokenExpiry)

module.exports = router;
