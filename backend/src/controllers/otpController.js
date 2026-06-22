const Otp =
  require("../models/Otp");

const sendEmail =
  require("../utils/sendEmail");

const sendOtp =
  async (req, res) => {
    try {
      const { email } =
        req.body;

      const otp =
        Math.floor(
          100000 +
            Math.random() *
              900000
        ).toString();

      await Otp.deleteMany({
        email,
      });

      await Otp.create({
        email,
        otp,
        expiresAt:
          new Date(
            Date.now() +
              5 *
                60 *
                1000
          ),
      });

      await sendEmail(
        email,
        otp
      );

      res.json({
        success: true,
        message:
          "OTP sent successfully",
      });
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

const verifyOtp =
  async (req, res) => {
    try {
      const {
        email,
        otp,
      } = req.body;

      const record =
        await Otp.findOne({
          email,
          otp,
        });

      if (!record) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid OTP",
          });
      }

      if (
        record.expiresAt <
        new Date()
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "OTP expired",
          });
      }

      await Otp.deleteMany({
        email,
      });

      res.json({
        success: true,
        message:
          "OTP verified",
      });
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

module.exports = {
  sendOtp,
  verifyOtp,
};