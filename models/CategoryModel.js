const { string } = require("joi");
const mongoose = require("mongoose");

// creating schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category required"],
      unique: [true, "This category already exists"],
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [32, "Name cannot exceed 32 characters"],
    },
    photo: String,
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// create model
const categoryModel = mongoose.model("Category", CategorySchema);
module.exports = categoryModel;
