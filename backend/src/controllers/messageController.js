const Message =
  require("../models/Message");

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
          content,
        });

      res.status(201).json(
        message
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

      res.json(messages);
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