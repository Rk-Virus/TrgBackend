const express = require("express");
const router = express.Router()

const {
    registerUser,
    loginUser,
    updateProfile,
    updatePassword,
    verifyCode,
    fetchCarousel,
    createAnnouncement,
    fetchAnnouncements,
    createMaterial,
    fetchMaterials,
    addBookmark,
    fetchBookmarks,
    checkIfBookmarked,
    submitDoubt,
    createQod,
    fetchQod,
    createQuiz,
    fetchQuizes,
    fetchQuiz,
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

// carousel apis
router.get("/fetch-carousel", fetchCarousel)
// router.post("/upload-carousel", uploadCarousel)

// announcement apis
router.post("/create-announcement", createAnnouncement)
router.get("/fetch-announcements", fetchAnnouncements)

// study material apis
router.post("/create-material", createMaterial)
router.post("/fetch-materials", fetchMaterials)

// bookmark apis
router.post("/add-bookmark", addBookmark)
router.get("/fetch-bookmarks/:userId", fetchBookmarks)
router.post("/check-if-bookmarked", checkIfBookmarked)

// doubt submit api
router.post("/submit-doubt", submitDoubt)

// qod apis
router.post("/create-qod", createQod)
router.get("/fetch-qod", fetchQod)

// quiz apis
router.post("/create-quiz", createQuiz)
router.post("/fetch-quizes", fetchQuizes)
router.get("/fetch-quiz/:id", fetchQuiz)

// 

module.exports = router