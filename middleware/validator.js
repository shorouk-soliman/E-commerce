// middlewares/validatorMiddleware.js
const { body, param, validationResult } = require("express-validator");

const validateCategory = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateOrder = [
  body("cartItems").isArray().withMessage("Products must be an array"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateCategory, validateOrder };
