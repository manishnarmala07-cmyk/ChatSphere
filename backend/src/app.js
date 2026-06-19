const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const healthRoutes = require("./routes/healthRoutes");

const notFound =
  require("./middleware/notFoundMiddleware");

const errorHandler =
  require("./middleware/errorMiddleware");

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("ChatSphere API");
});

app.use("/api/health", healthRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;