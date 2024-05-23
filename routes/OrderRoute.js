const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();

// GET all orders
router.get("/", authController.protect, orderController.getOrders);

// GET order by ID
router.get("/:id", orderController.getOrderById);
// GET order by user ID
router.get("/user/:userId", orderController.getOrdersByUserId); 

// POST place order
router.post("/:cartId", orderController.placeOrder);

// PATCH cancel order
router.patch("/:id/cancel", orderController.cancelOrder);

module.exports = router;
