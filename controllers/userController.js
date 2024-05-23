const User = require("./../models/userModel");
const userValidator = require("./../validation/userValidator");
const { cloudinaryUploadSingleImage } = require("../utils/cloudinary");
const path = require("path");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "No user found with that ID",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    //return error if user try to update password here
    if (req.body.password || req.body.passwordConfirm) {
      res.status(400).json({
        status: "fail",
        message:
          "this route is not for password updates. please use /updateMypassword",
      });
      return;
    }

    const imagePath = path.join(
      __dirname,
      `./../images/users/${req.file.filename}`
    );
    const uploadedImage = await cloudinaryUploadSingleImage(imagePath);

    const { error, value } = userValidator.updateUser({
      name: req.body.name,
      email: req.body.email,
      photo: uploadedImage.secure_url,
    });

    if (error) {
      res.status(400).json({
        status: "fail",
        message: "please enter valid data",
      });

      return;
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, value, {
      new: true, // return new document after update
      runValidators: true, //to run validation
    });
    if (!updatedUser) {
      res.status(400).json({
        status: "fail",
        message: "No user found  with that Id",
      });

      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        data: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
