const express =
  require("express");

const {
  sendGroupMessage,
  getGroupMessages,
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

router.get(
  "/:groupId",
  protect,
  getGroupMessages
);

module.exports = router;