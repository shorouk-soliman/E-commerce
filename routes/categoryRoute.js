const express = require("express");
const categoryController = require("../controllers/CategoryControllers");
const multer = require("../utils/multer");

const router = express.Router();

// GET all categories
router.get("/", categoryController.getCategories);

// GET category by ID
router.get("/:id", categoryController.getCategoryById);

// POST create category
router.post("/", multer.uploadCategoryPhoto, categoryController.createCategory);

// GET products by category ID
router.get("/:id/products", categoryController.getProductsByCategory);

module.exports = router;
