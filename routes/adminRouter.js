const express=require('express');
const router = express.Router();
const authController = require("./../controllers/authController");
const adminController = require("./../controllers/adminController")



router.get('/users',authController.protect,authController.restrictTo('admin'),adminController.getAllUsers);
router.get('/products',authController.protect,authController.restrictTo('admin'),adminController.getAllProducts);
router.get('/orders',authController.protect,authController.restrictTo('admin'),adminController.getAllOrders);
router.get('/categories',authController.protect,authController.restrictTo('admin'),adminController.getAllCategories);
router.patch('/orders/:orderId/update-status', authController.protect, authController.restrictTo('admin'), adminController.updateOrderStatus);

module.exports = router;
