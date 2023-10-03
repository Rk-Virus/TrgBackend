const express = require("express");
const router = express.Router()

const {
    registerUser,
    loginUser,
    updateProfile,
    updatePassword,
    sendMail,
    verifyCode
} = require("../controllers/commonControllers");

const { validateUserSignUp, userValidation } = require('../middlewares/validation/user')
const isAuthenticated = require('../middlewares/isAuthenticated')


// apis with their controllers
router.post("/register", validateUserSignUp, userValidation, registerUser)
router.post("/login", loginUser)
router.post("/update-profile", isAuthenticated, updateProfile)
router.post('/reset-password', updatePassword)

router.post("/verify-email", sendMail)  
router.post("/verify-code", verifyCode)  

module.exports = router