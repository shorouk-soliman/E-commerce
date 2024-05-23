const Cart = require("../models/Cartmodel");
const Product = require("../models/productModel");
const mongoose = require('mongoose'); // Import mongoose


//get user Cart

// const getCart = async (req, res) => {
//   const cart = await Cart.findOne({ user: req.user.id });
//   if (!cart) {
//     req.json({ message: "this user have no carts ........" });
//   }

//   res.status(200).json({
//     message: "cart retrieved successfully",
//     numOfCartItems: cart.cartItems.length,
//     data: cart,
//   });
// };
const getCart = async (req, res) => {
  try {
    // Find the cart for the current user and populate cartItems with product names
    const cart = await Cart.findOne({ user: req.user.id }).populate('cartItems.product', 'name');

    if (!cart) {
      return res.status(404).json({ message: "This user has no carts." });
    }

    // Calculate the total number of cart items
    const numOfCartItems = cart.cartItems.length;

    // Prepare the response data with populated product names
    const formattedCart = {
      _id: cart._id,
      cartItems: cart.cartItems.map(item => ({
        product: {
          _id: item.product._id,
          name: item.product.name, // Include product name
          quantity: item.quantity,
          color: item.color,
          price: item.price,
        },
      })),
      user: cart.user,
      totalCartPrice: cart.totalCartPrice,
    };

    // Send response with formatted cart data and number of cart items
    res.status(200).json({
      message: "Cart retrieved successfully",
      numOfCartItems: numOfCartItems,
      data: formattedCart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



//add product to cart
const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });

  cart.totalCartPrice = totalPrice;

  return totalPrice;
};

const addToCart = async (req, res) => {
  try {
    const { productId, color } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.json({ message: "Product not found!" });
    }
    //Check if the product quantity is greater than 0
    if (product.quantity <= 0) {
      return res.json({ message: "The product is out of stock" });
    }

    // Get cart for the logged user
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      //create cart for logged user with product
      cart = await Cart.create({
        user: req.user.id,
        cartItems: [{ product: productId, color, price: product.price }],
      });
    } else {
      // product exist in cart, update product quantity
      const productIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId && item.color === color
      );

      if (productIndex > -1) {
        //  Check if the number of product quantity is less than or equal to the number of product quantity in stock
        const cartItem = cart.cartItems[productIndex];
        if (product.quantity < cartItem.quantity + 1) {
          return res.json({
            message: `The quantity of ${product.name} is not available`,
          });
        }
        cartItem.quantity += 1;
        cart.cartItems[productIndex] = cartItem;
      } else {
        //  product not exist in cart, push product to cartItems array
        cart.cartItems.push({
          product: productId,
          color,
          price: product.price,
        });
      }
    }

    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({
      message: "Product added to cart successfully",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateCartItem = async (req, res) => {
  const { quantity, color } = req.body;
  const productId = req.params.productId;
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.json({ message: "No cart for this user" });
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === productId
  );

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    const product = await Product.findById(cartItem.product);
    // Check if the requested quantity is valid and available
    if (product.quantity < quantity || quantity < 0) {
      return res.json({
        message: `The quantity of ${product.name} is not available`,
      });
    }
    cartItem.quantity = quantity;
    cartItem.color = color;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return res.json({ message: "Product not found in cart" });
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    message: "Product added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
};

/////removeSpecificCartItem
// const removeCartItem = async (req, res) => {
//   const productId = req.params.productId;

//   const cart = await Cart.findOneAndUpdate(
//     { user: req.user.id },
//     { $pull: { cartItems: { _id: productId } } },
//     { new: true } // to return the updated document
//   );

//   calcTotalCartPrice(cart);
//   await cart.save();

//   res.status(200).json({
//     numOfCartItems: cart.cartItems.length,
//     data: cart,
//   });
// };
const removeCartItem = async (req, res) => {
  try {
    const productId = req.params.productId;

    const cart = await Cart.findOneAndUpdate(
      { 
        user: req.user.id,
        'cartItems.product': productId // Match based on product._id
      },
      { 
        $pull: { 
          cartItems: { product: productId } // Remove cart item with matching product._id
        } 
      },
      { new: true } // to return the updated document
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200).json({
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//clear user cart
const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user.id });
  res.status(204).json({ message: "cart deleted successfully" });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
