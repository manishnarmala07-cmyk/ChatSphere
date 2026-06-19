const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    application: "ChatSphere",
    version: "1.0.0",
    status: "Running"
  });
});

module.exports = router;