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

    deletedFor: {
      $ne:
        req.user._id,
    },
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
const editMessage =
  async (req, res) => {
    try {
      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {
        return res
          .status(404)
          .json({
            message:
              "Message not found",
          });
      }

      if (
        message.sender.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Not authorized",
          });
      }

      const tenMinutes =
  10 * 60 * 1000;

if (
  Date.now() -
    new Date(
      message.createdAt
    ).getTime() >
  tenMinutes
)
{
  return res
    .status(400)
    .json({
      message:
        "Edit time expired",
    });
}

      message.content =
        encryptMessage(
          req.body.content
        );

      message.edited =
        true;

      message.editedAt =
        new Date();

      await message.save();

      res.json({
        ...message.toObject(),
        content:
          req.body.content,
      });
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };
const deleteForMe =
  async (req, res) => {
    try {
      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {
        return res
          .status(404)
          .json({
            message:
              "Message not found",
          });
      }

      if (
        !message.deletedFor.includes(
          req.user._id
        )
      ) {
        message.deletedFor.push(
          req.user._id
        );

        await message.save();
      }

      res.json({
        message:
          "Deleted for me",
      });
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };
  const deleteForEveryone =
  async (req, res) => {
    try {
      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {
        return res
          .status(404)
          .json({
            message:
              "Message not found",
          });
      }

      if (
        message.sender.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Not authorized",
          });
      }

      message.deleted =
        true;

      message.content =
        encryptMessage(
          "This message was deleted"
        );

      await message.save();

      res.json({
        message:
          "Deleted for everyone",
      });
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };
  const deleteForBoth =
  async (req, res) => {
    try {
      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {
        return res
          .status(404)
          .json({
            message:
              "Message not found",
          });
      }

      if (
        message.sender.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Not authorized",
          });
      }

      await Message.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Deleted for both",
      });
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
  editMessage,
  deleteForMe,
  deleteForEveryone,
  deleteForBoth,
};