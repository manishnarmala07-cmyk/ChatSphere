const express =
  require("express");

const {
  sendGroupMessage,
  getGroupMessages,
  editGroupMessage,
  deleteGroupForMe,
  deleteGroupForEveryone,
} = require(
  "../controllers/groupMessageController"
);

const protect =
  require(
    "../middleware/authMiddleware"
  );

const router =
  express.Router();

router.post(
  "/",
  protect,
  sendGroupMessage
);

router.put(
  "/delete-for-me/:id",
  protect,
  deleteGroupForMe
);

router.put(
  "/delete-for-everyone/:id",
  protect,
  deleteGroupForEveryone
);

router.put(
  "/:id",
  protect,
  editGroupMessage
);

router.get(
  "/:groupId",
  protect,
  getGroupMessages
);
module.exports = router;