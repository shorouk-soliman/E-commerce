const User = require("./../models/userModel");
const userValidator = require("./../validation/userValidator");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
require("dotenv").config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  try {
    const { error, value } = userValidator.newUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    if (error) {
      res.status(400).json({
        status: "fail",
        message: "please enter valid data",
      });

      return;
    }
    if (await User.findOne({ email: value.email })) {
      res.status(400).json({
        status: "fail",
        message: "please enter valid email! this email already exist",
      });
      return;
    }
    const user = await User.create(req.body);

    const token = signToken(user._id);

    res.status(201).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    //check if email and password exist
    if (!email && !password) {
      res.status(400).json({
        status: "fail",
        message: "please provide email and password",
      });

      return;
    }

    //2)check if email exist and password correct
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(401).json({
        status: "fail",
        message: "incorrect email and/or password",
      });
      return;
    }

    const isCorrectPassword = await user.correctPassword(
      password,
      user.password
    );
    console.log(isCorrectPassword);
    if (!isCorrectPassword) {
      res.status(401).json({
        status: "fail",
        message: "incorrect email and/or password",
      });
      return;
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    //1)get token if exist
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        status: "fail",
        message: "you are not logged in! please login to get access",
      });
      return;
    }

    //2)validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //to make function return promise then call function

    //3)check if user still exist
    const currentUser = await User.findById(decoded.id);
    //  console.log(currentUser)

    if (!currentUser) {
      res.status(401).json({
        status: "fail",
        message: "the user belonging to this token not exist",
      });
      return;
    }
    //4)check if user change password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      res.status(401).json({
        status: "fail",
        message: "User recently changed password! Please log in again.",
      });
      return;
    }

    req.user = currentUser;
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "err",
    });
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['user','admin']
    try {
      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          //403 forbidden access resource
          status: "fail",
          message: "you don't have premssion to perform this action",
        });

        return;
      }
    } catch (err) {
      res.status(400).json({
        //403 forbidden access resource
        status: "fail",
        message: err,
      });
    }
    next();
  };
};

exports.updateMyPassword = async (req, res) => {
  try {
    // 1) get user from collection
    const user = await User.findById(req.user.id);

    // 2)check if posted current password  is correct
    if (!user.correctPassword(req.body.currentPassword, user.password)) {
      res.status(401).json({
        status: "fail",
        message: "Your current password is wrong",
      });
      return;
    }

    // 3) if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) log user in, send jwt
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
