const express = require("express");
const { handleIntent } = require("../controllers/paymentControllers");
const router = express.Router()

// stripe payment apis
router.post('/intent', handleIntent)

module.exports = router