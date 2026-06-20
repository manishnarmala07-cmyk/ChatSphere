const express =
  require("express");

const {
  createGroup,
  getGroups,
  joinGroup,
  searchGroups,
  getGroupDetails,
  leaveGroup,
  removeMember,
} = require(
  "../controllers/groupController"
);

const protect =
  require(
    "../middleware/authMiddleware"
  );

const router =
  express.Router();
router.get(
  "/details/:id",
  protect,
  getGroupDetails
);

router.put(
  "/leave/:id",
  protect,
  leaveGroup
);

router.put(
  "/remove/:id",
  protect,
  removeMember
);
// Search Groups
router.get(
  "/search",
  protect,
  searchGroups
);

// Create Group
router.post(
  "/",
  protect,
  createGroup
);

// My Groups
router.get(
  "/",
  protect,
  getGroups
);

// Join Group
router.post(
  "/join",
  protect,
  joinGroup
);

module.exports = router;