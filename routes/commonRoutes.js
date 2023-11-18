const express = require("express");
const router = express.Router()

const {
    registerUser,
    loginUser,
    updateProfile,
    updatePassword,
    verifyCode,
    fetchCarousel,
    // uploadCarousel
} = require("../controllers/commonControllers");

const { validateUserSignUp, userValidation } = require('../middlewares/validation/user')
const isAuthenticated = require('../middlewares/isAuthenticated')


// apis with their controllers
router.post("/register", validateUserSignUp, userValidation, registerUser)
router.post("/login", loginUser)
router.post("/update-profile", isAuthenticated, updateProfile)
router.post('/reset-password', updatePassword)

// email verification
router.post("/verify-code", verifyCode)  

// fetching carousel
router.get("/fetch-carousel", fetchCarousel)
// router.post("/upload-carousel", uploadCarousel)

module.exports = router