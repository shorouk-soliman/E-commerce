// controllers/orderController.js
const { validationResult } = require("express-validator");
const orderService = require("../Services/orderServices");
const Cart = require("../models/Cartmodel");
const Order = require("../models/OrderModel");

const getOrders = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "user") filter = { user: req.user.id };
    const orders = await Order.find(filter);
    res.json({ orders });
  } catch (error) {
    console.error("Error getting orders:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error getting order by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const placeOrder = async (req, res) => {
//   const orderData = req.body;

//   try {
//     const order = await orderService.placeOrderService(orderData);
//     res.status(201).json(order);
//   } catch (error) {
//     const errors = validationResult(error);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     console.error("Error placing order:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const placeOrder = async (req, res, next) => {
  // const orderData = req.body;
  const taxPrice = 0;
  const shippingPrice = 0;

  //1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    throw new Error(`Cart is not available ${req.session.cartId}`);
  }
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // create order
  const order = await orderService.placeOrderService({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    status: "accepted",
  });

  // decrement quantity and increment sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Item.bulkWrite(bulkOption, {});

    // clear cart
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({
    status: "success",
    data: order,
  });
};

const cancelOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const canceledOrder = await orderService.cancelOrder(orderId);
    res.json(canceledOrder);
  } catch (error) {
    console.error("Error canceling order:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getOrdersByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await orderService.getOrdersByUserId(userId);
    res.json(orders);
  } catch (error) {
    console.error("Error getting orders by user ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getOrders, getOrderById, placeOrder, cancelOrder,getOrdersByUserId };

