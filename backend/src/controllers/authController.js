const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// ======================
// Register User
// ======================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// ======================
// Login User
// ======================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.isGoogleUser) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// ======================
// Google Login
// ======================
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential missing",
      });
    }

    const ticket =
      await client.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    let user = await User.findOne({
      email,
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        isGoogleUser: true,
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(401);
    throw new Error(
      "Google authentication failed"
    );
  }
};

// ======================
// Get Profile
// ======================
const getProfile = async (
  req,
  res
) => {
  res.json({
    success: true,
    user: req.user,
  });
};

const getAllUsers =
  async (req, res) => {
    try {
      const users =
        await User.find({
          _id: {
            $ne: req.user._id,
          },
        }).select(
          "_id name email avatar"
        );

      res.json(users);
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

const searchUsers =
  async (req, res) => {
    try {
      const query =
        req.query.q || "";

      const users =
        await User.find({
          name: {
            $regex: query,
            $options: "i",
          },
          _id: {
            $ne:
              req.user._id,
          },
        }).select(
          "_id name email"
        );

      res.json(users);
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };
  
module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getProfile,
  getAllUsers,
  searchUsers,
};