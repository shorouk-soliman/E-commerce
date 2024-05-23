const express = require("express");
const router = express.Router({ mergeParams: true });
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const multer = require("../utils/multer");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authController.protect, userController.getProfile);
router.patch(
  "/profile",
  authController.protect,
  multer.uploadUserPhoto,
  userController.updateProfile
);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updateMyPassword
);

module.exports = router;
