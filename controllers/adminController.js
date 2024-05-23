const Order = require("../models/OrderModel");
const User = require("./../models/userModel");
const Product = require("./../models/productModel");
const Category = require("./../models/CategoryModel");
 
exports.getAllProducts = async(req,res) =>{
    try{
      const products = await Product.find();
      res.status(200).json({
        status:'success',
        result:products.length,
        data:{
             products
        }
      })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
}


exports.getAllUsers = async(req,res) =>{
    try{
      const users= await User.find();
      res.status(200).json({
        status:'success',
        result:users.length,
        data:{
             users
        }
      })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
}

exports.getAllCategories = async(req,res) =>{
  try{
    const Categories = await Category.find();
    res.status(200).json({
      status:'success',
      result:Category.length,
      data:{
           Categories
      }
    })
  }catch(err){
      res.status(400).json({
          status:'fail',
          message:err
      })
  }
}


exports.getAllOrders = async(req,res) =>{
  try{
    const orders= await Order.find();
    console.log(orders);
    res.status(200).json({
      status:'success',
      result:orders.length,
      data:{
           orders
      }
    })
  }catch(err){
      res.status(400).json({
          status:'fail',
          message:err
      })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { newStatus } = req.body;

    // Find the order by ID and update the status
    const order = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });

    if (!order) {
      return res.status(404).json({ status: 'fail', message: 'Order not found' });
    }

    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};



 