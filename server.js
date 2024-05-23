require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const cartRoute = require("./routes/cartroutes");
const paymentRoute = require("./routes/paymentRouter");
const adminRouter = require("./routes/adminRouter");
const categoryRoute = require("./routes/categoryRoute");
const orderRoute = require("./routes/OrderRoute");
dotenv.config({ path: "./.env" });
const { webhookCheckout } = require("./controllers/paymentController");

//middlewares

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// compress all responses
app.use(compression());

// Set security HTTP headers
app.use(helmet());

app.use(cors());
app.options("*", cors());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }, { limit: "10kb" }));

//Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/checkout", paymentRoute);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/orders", orderRoute);

//Serve images in directory named images
app.use(express.static("uploads"));

//DB
mongoose
  .connect(process.env.DBURL)
  .then(() => console.log("DB connected successfully..."))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`app listen on port ${port}`);
});


