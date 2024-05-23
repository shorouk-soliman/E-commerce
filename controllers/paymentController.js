const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/Cartmodel");
const Order = require("../models/OrderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

exports.getCheckout = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cartId);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartPrice = cart.totalCartPrice;
    const totalOrderPrice = cartPrice;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "egp",
            unit_amount: totalOrderPrice * 100,
            product_data: {
              name: req.user.name,
            },
          },
        },
      ],
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: req.user.email,
      success_url: `http://localhost:4200/`,
      cancel_url: `http://localhost:4200/carts`,
      customer_email: req.user.email,
      client_reference_id: req.params.cartId,
    });

    res.status(200).json({ status: "Success", session });
  } catch (error) {
    next(error);
  }
};

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });
  // Create order with default paymentMethod card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    totalPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    PaymentMethod: "card",
    status: "accepted",
  });
  //  After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOption, {});

    // 3) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};

exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    //  Create order
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
};
