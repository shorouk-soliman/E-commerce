const express = require("express");
const { getCheckout } = require("../controllers/paymentController");

const router = express.Router();
const authController = require("./../controllers/authController");

router.post("/checkout-session/:cartId", authController.protect, getCheckout);

module.exports = router;
