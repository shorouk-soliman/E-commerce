// services/orderService.js
const Order = require("../models/OrderModel");

const getAllOrders = async () => {
  return await Order.find().populate("user").populate("cartItems.product");
};

const getOrderById = async (orderId) => {
  return await Order.findById(orderId)
    .populate("user")
    .populate("cartItems.product");
};

// const placeOrder = async (orderData) => {
//   return await Order.create(orderData);
// };

const placeOrderService = async (orderData) => {
  try {
    const order = await Order.create(orderData);
    return order;
  } catch (error) {
    throw error;
  }
};

const cancelOrder = async (orderId) => {
  return await Order.findByIdAndDelete(
    orderId,
    { isCancelled: true },
    { new: true }
  );
};

const getOrdersByUserId = async (userId) => {
  return await Order.find({ user: userId })
    .populate("user")
    .populate("cartItems.product");
};

module.exports = { getAllOrders, getOrderById, placeOrderService, cancelOrder, getOrdersByUserId };


