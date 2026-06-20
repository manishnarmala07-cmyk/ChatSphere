const User =
  require("../models/User");

const Group =
  require("../models/Group");

const Message =
  require("../models/Message");

const GroupMessage =
  require(
    "../models/GroupMessage"
  );

const GroupInvite =
  require(
    "../models/GroupInvite"
  );
const jwt =
  require("jsonwebtoken");

const adminLogin =
  async (req, res) => {
    try {
      const { secret } =
        req.body;

      if (
        secret !==
        process.env
          .ADMIN_SECRET
      ) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Invalid admin secret",
          });
      }

      const token =
        jwt.sign(
          {
            admin: true,
          },
          process.env.JWT_SECRET,
          {
            expiresIn:
              "24h",
          }
        );

      res.json({
        success: true,
        token,
      });
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };
const getStats =
  async (req, res) => {
    try {
      const users =
        await User.countDocuments();

      const groups =
        await Group.countDocuments();

      const privateMessages =
        await Message.countDocuments();

      const groupMessages =
        await GroupMessage.countDocuments();

      const pendingInvites =
        await GroupInvite.countDocuments(
          {
            status:
              "pending",
          }
        );

      const onlineUsers =
        global.onlineUsers
          ? global
              .onlineUsers
              .size
          : 0;

      res.json({
        users,
        groups,
        privateMessages,
        groupMessages,
        pendingInvites,
        onlineUsers,
      });
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };
module.exports = {
  adminLogin,
  getStats,
};