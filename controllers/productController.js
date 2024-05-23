const Product = require("./../models/productModel");
const productValidator = require("./../validation/productValidator");
const path = require("path");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

exports.createProduct = async (req, res) => {
  try {
    const imagePaths = req.files.map((file) =>
      path.join(__dirname, `./../images/products/${file.filename}`)
    );
    const result = await cloudinaryUploadImage(imagePaths);
    console.log(result);
    const colorsArray = req.body.colors.split(",").map((color) => color.trim());
    const { error, value } = productValidator.newProduct({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      colors: colorsArray,
      category: req.body.category,
      images: result.map((file) => file.secure_url),
    });
    console.log(value);
    console.log(error);
    if (error) {
      res.status(400).json({
        status: "fail",
        message: "please enter valid data",
      });

      return;
    }
    const newProduct = await Product.create(value);
    console.log(newProduct);
    res.status(201).json({
      status: "success",
      data: {
        newProduct,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateProduct = async (req, res) => {
  const imagePaths = req.files.map((file) =>
    path.join(__dirname, `./../images/products/${file.filename}`)
  );
  const result = await cloudinaryUploadImage(imagePaths);
  console.log(result);
  const colorsArray = req.body.colors.split(",").map((color) => color.trim());

  try {
    const { error, value } = productValidator.updateProduct({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      colors: colorsArray,
      category: req.body.category,
      images: result.map((file) => file.secure_url),
    });

    if (error) {
      res.status(400).json({
        status: "fail",
        message: "please enter valid data",
      });

      return;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      value,
      {
        new: true, // return new document after update
        runValidators: true, //to run validation
      }
    );
    console.log(updatedProduct);
    if (!updatedProduct) {
      res.status(400).json({
        status: "fail",
        message: "No product found  with that Id",
      });

      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        data: updatedProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      res.status(400).json({
        status: "fail",
        message: "No product found  with that Id",
      });

      return;
    }

    res.status(200).json({
      status: "success",
      message: "product deleted  sucessfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// exports.getAllProduct = async (req,res)=>{
//     try{

//       const allProducts= await Product.find().select('name description price category ratingsQuantity ratingsAverage images');

//       res.status(200).json({
//           status: 'success',
//           results:allProducts.length,
//           data:{
//             allProducts
//           }
//         });

//       } catch(err){
//         res.status(400).json({
//           status:'fail',
//           message:err,
//         })
//       }
//   }

exports.getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const sortField = req.query.sortField || "name";
    const sortOrder = req.query.sortOrder || "asc";

    const startIndex = (page - 1) * limit;

    let query = Product.find().select(
      "name description price category ratingsQuantity ratingsAverage images"
    );

    query = query.sort({ [sortField]: sortOrder });

    query = query.skip(startIndex).limit(limit);

    const allProducts = await query;

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      status: "success",
      results: allProducts.length,
      totalResults: totalProducts,
      currentPage: page,
      totalPages: totalPages,
      data: {
        allProducts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");
    if (!product) {
      res.status(400).json({
        status: "fail",
        message: "No product found  with that Id",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
