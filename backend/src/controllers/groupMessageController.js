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

module.exports = {
  sendGroupMessage,
  getGroupMessages,
};