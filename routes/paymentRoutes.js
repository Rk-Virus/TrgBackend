const express = require("express");
const { handleIntent, addPaidMaterial } = require("../controllers/paymentControllers");
const router = express.Router()

// stripe payment apis
router.post('/intent', handleIntent)

// buying webhook
router.post('/buyMaterial', addPaidMaterial)

module.exports = router