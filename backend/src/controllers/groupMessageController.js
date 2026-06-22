const GroupMessage =
  require(
    "../models/GroupMessage"
  );
const {
  encryptMessage,
  decryptMessage,
} = require(
  "../utils/encryption"
);
const sendGroupMessage =
  async (req, res) => {
    try {
      const {
        groupId,
        content,
      } = req.body;

      const message =
  await GroupMessage.create({
    groupId,
    sender: req.user._id,
    content: encryptMessage(content),
  });

const populatedMessage =
  await GroupMessage
    .findById(message._id)
    .populate(
      "sender",
      "name"
    );
const decryptedMessage =
{
  ...populatedMessage.toObject(),
  content:
    decryptMessage(
      populatedMessage.content
    ),
};
res.status(201).json(
  decryptedMessage
);
    } catch (error) {
      res.status(500);
      throw new Error(
        error.message
      );
    }
  };

const getGroupMessages =
  async (req, res) => {
    try {
      const messages =
  await GroupMessage.find(
    {
      groupId:
        req.params
          .groupId,

      deletedFor: {
        $ne:
          req.user._id,
      },
    }
  )
          .populate(
            "sender",
            "name"
          )
          .sort({
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
const editGroupMessage =
  async (req, res) => {
    try {
      const message =
        await GroupMessage.findById(
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

      const updated =
        await GroupMessage
          .findById(
            message._id
          )
          .populate(
            "sender",
            "name"
          );

      res.json({
        ...updated.toObject(),
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
  const deleteGroupForMe =
  async (req, res) => {
    try {
      const message =
        await GroupMessage.findById(
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
  const deleteGroupForEveryone =
  async (req, res) => {
    try {
      const message =
        await GroupMessage.findById(
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

module.exports = {
  sendGroupMessage,
  getGroupMessages,
  editGroupMessage,
  deleteGroupForMe,
  deleteGroupForEveryone,
};