const express =
  require("express");

const {
  sendMessage,
  getMessages,
  editMessage,
  deleteForMe,
  deleteForEveryone,
  deleteForBoth,
} = require(
  "../controllers/messageController"
);

const protect =
  require("../middleware/authMiddleware");

const router =
  express.Router();

router.post(
  "/",
  protect,
  sendMessage
);

router.put(
  "/delete-for-me/:id",
  protect,
  deleteForMe
);

router.put(
  "/delete-for-everyone/:id",
  protect,
  deleteForEveryone
);

router.delete(
  "/delete-for-both/:id",
  protect,
  deleteForBoth
);

router.put(
  "/:id",
  protect,
  editMessage
);

router.get(
  "/:userId",
  protect,
  getMessages
);
module.exports = router;