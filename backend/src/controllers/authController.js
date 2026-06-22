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
    const {
      name,
      username,
      email,
      password,
    } = req.body;
    const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (
      !name ||
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }
    if (
  !emailRegex.test(email)
) {
  return res
    .status(400)
    .json({
      success: false,
      message:
        "Invalid email format",
    });
}
if (
  !passwordRegex.test(
    password
  )
) {
  return res
    .status(400)
    .json({
      success: false,
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
    });
}
    const existingEmail =
      await User.findOne({
        email,
      });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message:
          "Email already registered",
      });
    }

    const existingUsername =
      await User.findOne({
        username,
      });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message:
          "Username already taken",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name,
        username,
        email,
        password:
          hashedPassword,
      });

    res.status(201).json({
      success: true,
      token: generateToken(
        user._id
      ),
      user: {
        id: user._id,
        name: user.name,
        username:
          user.username,
        email:
          user.email,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error(
      error.message
    );
  }
};

// ======================
// Login User
// ======================
const loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    res.json({
      success: true,
      token: generateToken(
        user._id
      ),
      user: {
        id: user._id,
        name: user.name,
        username:
          user.username,
        email:
          user.email,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error(
      error.message
    );
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

    let user =
      await User.findOne({
        email,
      });

    if (!user) {

      let username =
        email.split("@")[0];

      let existingUsername =
        await User.findOne({
          username,
        });

      if (existingUsername) {
        username =
          `${username}${Date.now()
            .toString()
            .slice(-4)}`;
      }

      user =
        await User.create({
          name,
          username,
          email,
          avatar: picture,
          isGoogleUser: true,
        });
    }

    res.json({
      success: true,
      token:
        generateToken(
          user._id
        ),
      user: {
        id: user._id,
        name: user.name,
        username:
          user.username,
        email:
          user.email,
        avatar:
          user.avatar,
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
    user: {
      id: req.user._id,
      name:
        req.user.name,
      username:
        req.user.username,
      email:
        req.user.email,
      avatar:
        req.user.avatar,
    },
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
const updateUsername =
  async (req, res) => {
    try {

      const {
        username,
      } = req.body;

      if (
        !username
      ) {
        return res
          .status(400)
          .json({
            message:
              "Username required",
          });
      }

      const existingUser =
        await User.findOne({
          username,
        });

      if (
        existingUser &&
        existingUser._id.toString() !==
          req.user._id.toString()
      ) {
        return res
          .status(400)
          .json({
            message:
              "Username already taken",
          });
      }

      req.user.username =
        username;

      await req.user.save();

      res.json({
        success: true,
        username:
          req.user.username,
      });

    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

const changePassword =
  async (req, res) => {
    try {

      const {
        currentPassword,
        newPassword,
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      const match =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!match) {
        return res
          .status(400)
          .json({
            message:
              "Current password incorrect",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      res.json({
        success: true,
        message:
          "Password updated",
      });

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
  updateUsername,
  changePassword,
};