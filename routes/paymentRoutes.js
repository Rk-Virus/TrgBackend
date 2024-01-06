const express = require("express");
const { handleIntent, createOrder, verifyPayment } = require("../controllers/paymentControllers");
const router = express.Router()

// stripe payment apis
router.post('/intent', handleIntent)

// razorpay payment apis
router.post('/create-order/', createOrder)
router.post('/verify-payment/', verifyPayment)

module.exports = router