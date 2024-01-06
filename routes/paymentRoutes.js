const express = require("express");
const {createOrder, verifyPayment } = require("../controllers/paymentControllers");
const router = express.Router()

// razorpay payment apis
router.post('/create-order/', createOrder)
router.post('/verify-payment/', verifyPayment)

module.exports = router