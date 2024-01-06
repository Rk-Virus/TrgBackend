const express = require("express");
const { handleIntent, createOrder } = require("../controllers/paymentControllers");
const router = express.Router()

// stripe payment apis
router.post('/intent', handleIntent)

// razorpay payment apis
router.post('/create-order/', createOrder)

module.exports = router