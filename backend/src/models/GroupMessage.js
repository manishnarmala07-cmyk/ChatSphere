const mongoose = require("mongoose");

const groupMessageSchema =
  new mongoose.Schema(
    {
      groupId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
      },

      sender: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      content: {
        type: String,
        required: true,
      },

      edited: {
        type: Boolean,
        default: false,
      },

      editedAt: {
        type: Date,
        default: null,
      },
      deleted: {
        type: Boolean,
        default: false,
      },

      deletedFor: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      status: {
  type: String,
  enum: [
    "sent",
    "delivered",
    "read",
  ],
  default: "sent",
},
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "GroupMessage",
    groupMessageSchema
  );