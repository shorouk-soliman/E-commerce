const Category = require("../models/CategoryModel");
const Product = require("../models/productModel");

const getAllCategories = async () => {
  return await Category.find();
};

const getCategoryById = async (categoryId) => {
  return await Category.findById(categoryId);
};

const createCategory = async ({ name, photo }) => {
  return await Category.create({
    name,
    photo,
  });
};

const getProductsByCategory = async (categoryId) => {
  return await Product.find({ category: categoryId });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  getProductsByCategory,
};
