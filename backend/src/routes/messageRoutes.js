const express =
  require("express");

const {
  sendMessage,
  getMessages,
  editMessage,
  deleteForMe,
  deleteForEveryone,
  deleteForBoth,
  markDelivered,
  markRead,
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
  "/delivered/:id",
  protect,
  markDelivered
);

router.put(
  "/read/:id",
  protect,
  markRead
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