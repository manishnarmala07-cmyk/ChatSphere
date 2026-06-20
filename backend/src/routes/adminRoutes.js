const express =
  require("express");

const {
  adminLogin,
  getStats,
} = require(
  "../controllers/adminController"
);

const adminProtect =
  require(
    "../middleware/adminMiddleware"
  );

const router =
  express.Router();

router.post(
  "/login",
  adminLogin
);

router.get(
  "/stats",
  adminProtect,
  getStats
);

module.exports =
  router;