const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const auth = require("../middleware/auth");
const {
  validateSignup,
  validateLogin,
  validateRequest,
} = require("../middleware/validation");

router.post("/signup", validateSignup, validateRequest, authController.signup);
router.post("/login", validateLogin, validateRequest, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.get("/profile", auth, authController.getProfile);

module.exports = router;
