const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

router.post('/ratings',authController.protect,authController.restrictTo('user'),reviewController.CreateRating);
router.post('/reviews',authController.protect,authController.restrictTo('user'),reviewController.CreateReview);
router.get('/reviews',authController.protect,authController.restrictTo('user'),reviewController.getReviews);


module.exports = router;