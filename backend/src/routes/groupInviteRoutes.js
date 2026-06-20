const express =
  require("express");

const {
  sendInvite,
  getInvites,
  acceptInvite,
  rejectInvite,
} = require(
  "../controllers/groupInviteController"
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
  sendInvite
);

router.get(
  "/",
  protect,
  getInvites
);

router.put(
  "/accept/:id",
  protect,
  acceptInvite
);

router.put(
  "/reject/:id",
  protect,
  rejectInvite
);

module.exports =
  router;