const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = require("./src/app");

const connectDB =
  require("./src/config/db");
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ChatSphere API Running"
  });
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});