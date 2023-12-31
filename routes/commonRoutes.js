const express = require("express");
const router = express.Router()

const {
    registerUser,
    loginUser,
    updateProfile,
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
    uploadCarousel,
    fetchPaidMaterials,
    fetchPaidQuizzes,
    sendOTP,
    addVideo,
    fetchVideos,
} = require("../controllers/commonControllers");

const { validateUserSignUp, userValidation } = require('../middlewares/validation/user')
const isAuthenticated = require('../middlewares/isAuthenticated')


// apis with their controllers
router.post("/register", validateUserSignUp, userValidation, registerUser)
router.post("/login", loginUser)
router.post("/update-profile", isAuthenticated, updateProfile)

// email verification
router.post("/verify-code", verifyCode)  

// carousel apis
router.get("/fetch-carousel", fetchCarousel)
router.post("/upload-carousel/:key", uploadCarousel)

// announcement apis
router.post("/create-announcement/:key", createAnnouncement)
router.get("/fetch-announcements", fetchAnnouncements)

// study material apis
router.post("/create-material/:key", createMaterial)
router.post("/fetch-materials/:id", fetchMaterials)

// bookmark apis
router.post("/add-bookmark", addBookmark)
router.get("/fetch-bookmarks/:userId", fetchBookmarks)
router.post("/check-if-bookmarked", checkIfBookmarked)

// doubt submit api
router.post("/submit-doubt", submitDoubt)

// qod apis
router.post("/create-qod/:key", createQod)
router.get("/fetch-qod", fetchQod)

// quiz apis
router.post("/create-quiz/:key", createQuiz)
router.post("/fetch-quizes/:id", fetchQuizes)
router.get("/fetch-quiz/:id", fetchQuiz)

// paid api
router.get("/fetch-paid-materials/:id", fetchPaidMaterials)
router.get("/fetch-paid-quizes/:id", fetchPaidQuizzes)

//forgot password
router.post("/send-otp", sendOTP)

//video apis
router.post("/add-video/:key", addVideo)
router.get("/fetch-videos", fetchVideos)

module.exports = router