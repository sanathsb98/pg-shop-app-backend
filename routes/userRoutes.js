const express = require('express');
const router = express.Router();
const userControl = require('../controllers/userControl');

router.get('/allUsers',userControl.getFullUsers)
router.post('/signUp',userControl.createNewUser)
router.post('/logIn',userControl.loginUser)
router.post('/resetPassword',userControl.resetPassword)
router.get('/verifyResetToken',userControl.verifyResetPassToken)
router.post('/updatePassword',userControl.updateUserPassword)

module.exports = router;
