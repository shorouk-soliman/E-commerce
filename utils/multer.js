const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const Filestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/products"); // determine the images place
  },
  filename: function (req, file, cb) {
    cb(null, `product-${uuidv4()}-${Date.now()}.jpeg`); // determine unique images name
  },
});

const fileFilter = (req, file, cb) => {
  if (file) {
    // Check if file exists
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    cb(new Error("No file uploaded"), false);
  }
};

const upload = multer({ storage: Filestorage, fileFilter: fileFilter }).any(
  "images"
);
//.single
exports.uploadProductPhoto = upload;

////////////////////////////////////////////// UsersPHotos

// //multer configure
const FilestorageForUser = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/users"); // determine the photos place after user upload it
  },
  filename: function (req, file, cb) {
    cb(null, `user-${req.user.id}-${Date.now()}.jpeg`); //determine unique photo name
  },
});

const fileFilterForUser = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const uploadForUser = multer({
  storage: FilestorageForUser,
  fileFilter: fileFilterForUser,
}).single("photo");
exports.uploadUserPhoto = uploadForUser;

//multer configure
const FileStorageForCategory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/categories"); // determine the photos place after user upload it
  },
  filename: function (req, file, cb) {
    cb(null, `categories-${uuidv4()}-${Date.now()}.jpeg`); //determine unique photo name
  },
});

const fileFilterForCategory = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const uploadForCategory = multer({
  storage: FileStorageForCategory,
  fileFilter: fileFilterForCategory,
}).single("photo");
exports.uploadCategoryPhoto = uploadForCategory;

//array for multiple

//array for multiple
//any() for any number of images
