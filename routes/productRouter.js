const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('./../controllers/authController');
const multer = require('../utils/multer');
const productController = require('./../controllers/productController');
const reviewRouter = require('./../routes/reviewRouter');



router.post("/",authController.protect,authController.restrictTo('admin'),multer.uploadProductPhoto,productController.createProduct);
router.patch("/:id",authController.protect,authController.restrictTo('admin'),multer.uploadProductPhoto,productController.updateProduct);
router.delete("/:id",authController.protect,authController.restrictTo('admin'),productController.deleteProduct);
router.get("/:id",productController.getOneProduct);
router.get("/",productController.getAllProduct);



router.use('/:id', reviewRouter);

module.exports = router;