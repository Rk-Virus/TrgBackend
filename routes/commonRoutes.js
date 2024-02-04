const express = require("express");
const router = express.Router()

const {
    registerUser,
    loginUser,
    loginAdmin,
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

const { createCareerForm, updateCareerForm, deleteCareerForm, getAllCareerForms,
    createFranchiseForm, updateFranchiseForm, deleteFranchiseForm, getAllFranchiseForms,
    createInternshipForm, updateInternshipForm, deleteInternshipForm, getAllInternshipForms, getCareerForm, getFranchiseForm, getInternshipForm   
 } = require("../controllers/adminControllers");

const { validateUserSignUp, userValidation } = require('../middlewares/validation/user')
const { isAuthenticated, verifyAdmin } = require('../middlewares/isAuthenticated')

// MULTER code
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, "../files");
    // Create the destination directory if it doesn't exist
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
});

const upload = multer({ storage: storage });

// apis with their controllers
router.post("/register", validateUserSignUp, userValidation, registerUser)
router.post("/login", loginUser)
router.post("/admin-login", loginAdmin)
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

// Forms api
router.post("/career-form/", upload.single("file"), createCareerForm);
router.put("/career-form/:id", verifyAdmin, updateCareerForm);
router.delete("/career-form/:id", verifyAdmin, deleteCareerForm);
router.get("/career-form/:id", verifyAdmin, getCareerForm);
router.get("/career-form/", verifyAdmin, getAllCareerForms);
 
router.post("/franchise-form/", createFranchiseForm);
router.put("/franchise-form/:id", verifyAdmin, updateFranchiseForm);
router.delete("/franchise-form/:id", verifyAdmin, deleteFranchiseForm);
router.get("/franchise-form/:id", verifyAdmin, getFranchiseForm);
router.get("/franchise-form/", verifyAdmin, getAllFranchiseForms);
 
router.post("/internship-form/", createInternshipForm);
router.put("/internship-form/:id", verifyAdmin, updateInternshipForm);
router.delete("/internship-form/:id", verifyAdmin, deleteInternshipForm);
router.get("/internship-form/:id", verifyAdmin, getInternshipForm);
router.get("/internship-form/", verifyAdmin, getAllInternshipForms);
 

module.exports = router