const { string } = require('joi');
const mongoose = require('mongoose');
const Category = require('./CategoryModel');
const productSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "product name is required"],
      },
      description: {
        type: String,
        required: [true, "product description is required"],
      },
      price: {
        type: Number,
        required: [true, "product price is required"],
      },
 
      quantity: {
        type: Number,
        required: [true, "product quantity required"],
      },
     
      images:[String],
      colors: [String],
      category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product must be belong to category'],
      },
      ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
        default:4.5
      },
      ratingsQuantity: {
        type: Number,
        default: 0,
      },
      
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
  );
  

  productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
  });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
  