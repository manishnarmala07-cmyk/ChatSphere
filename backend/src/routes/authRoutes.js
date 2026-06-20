const express = require("express");

const {
  registerUser,
  loginUser,
  googleLogin,
  getProfile,
  getAllUsers,
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

// Get All Users
router.get(
  "/users",
  protect,
  getAllUsers
);

module.exports = router;