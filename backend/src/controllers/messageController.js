const Message =
  require("../models/Message");
const {
  encryptMessage,
  decryptMessage,
} = require(
  "../utils/encryption"
);
const sendMessage =
  async (req, res) => {
    try {
      const {
        receiver,
        content,
      } = req.body;

      const message =
        await Message.create({
          sender:
            req.user._id,
          receiver,
          content:
            encryptMessage(
              content
            ),
        });

      const responseMessage =
        {
          ...message.toObject(),
          content,
        };

      res.status(201).json(
        responseMessage
      );
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };
const getMessages =
  async (req, res) => {
    try {
      const otherUserId =
        req.params.userId;

      const messages =
        await Message.find({
          $or: [
            {
              sender:
                req.user._id,
              receiver:
                otherUserId,
            },
            {
              sender:
                otherUserId,
              receiver:
                req.user._id,
            },
          ],
        }).sort({
          createdAt: 1,
        });

      const decrypted =
            messages.map(
              (message) => ({
                ...message.toObject(),
                content:
                  decryptMessage(
                    message.content
                  ),
              })
            );

          res.json(
            decrypted
          );
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

module.exports = {
  sendMessage,
  getMessages,
};