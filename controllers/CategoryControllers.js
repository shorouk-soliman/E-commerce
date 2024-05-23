const { validationResult } = require("express-validator");
const categoryService = require("../Services/CategoryServices");

const { cloudinaryUploadSingleImage } = require("../utils/cloudinary");
const path = require("path");

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error getting categories:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await categoryService.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error getting category by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createCategory = async (req, res) => {
  try {
    const imagePath = path.join(
      __dirname,
      `../images/categories/${req.file.filename}`
    );
    const uploadedImage = await cloudinaryUploadSingleImage(imagePath);

    const category = await categoryService.createCategory({
      name: req.body.name,
      photo: uploadedImage.secure_url,
    });
    res.status(201).json(category);
  } catch (error) {
    const errors = validationResult(error);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.error("Error creating category:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const products = await categoryService.getProductsByCategory(categoryId);
    if (!products || !products.length) {
      return res.json([]);
    }
    res.json(products);
  } catch (error) {
    console.error("Error getting products by category:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  getProductsByCategory,
};
