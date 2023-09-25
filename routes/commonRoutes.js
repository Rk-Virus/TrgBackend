const express = require("express");
const router = express.Router()

const {
     fetchUser, 
            logoutUser, 
            registerUser, 
            loginUser, 
            updateProfile, 
            updatePassword, 
        } = require("../controllers/commonControllers");

const {validateUserSignUp, userValidation} = require('../middlewares/validation/user')

router.post("/register",
 validateUserSignUp, userValidation, 
 registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/fetch-user",
//  isAuthenticated,
 fetchUser)
router.post("/update-profile", 
// isAuthenticated,
 updateProfile)
router.post('/reset-password', updatePassword)

module.exports = router