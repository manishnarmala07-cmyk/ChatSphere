const express = require("express");

const {
  registerUser,
  loginUser,
  googleLogin,
  getProfile,
} = require(
  "../controllers/authController"
);

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// Register
router.post(
  "/register",
  registerUser
);

// Login
router.post(
  "/login",
  loginUser
);

// Google Login
router.post(
  "/google",
  googleLogin
);

// Protected Profile
router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;