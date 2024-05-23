const express=require('express');
const router = express.Router();
const {getCart,addToCart,updateCartItem,removeCartItem,clearCart}=require('../controllers/cartController');
 const authController = require("./../controllers/authController");
 
router.get('/',authController.protect,getCart);
router.post('/',authController.protect,addToCart);
router.patch('/:productId',authController.protect,updateCartItem);
router.delete('/:productId',authController.protect,removeCartItem);
router.delete('/',authController.protect,clearCart);


module.exports = router;


