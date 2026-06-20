const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const groupRoutes =
  require(
    "./routes/groupRoutes"
  );

const groupMessageRoutes =
  require(
    "./routes/groupMessageRoutes"
  );
const groupInviteRoutes =
  require(
    "./routes/groupInviteRoutes"
  );

const adminRoutes =
  require(
    "./routes/adminRoutes"
  );
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");
const passport =
  require("./config/passport");

  const messageRoutes =
  require(
    "./routes/messageRoutes"
  );
const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("ChatSphere API");
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use(
  "/api/messages",
  messageRoutes
);
app.use(
  "/api/groups",
  groupRoutes
);

app.use(
  "/api/group-messages",
  groupMessageRoutes
);

app.use(
  "/api/group-invites",
  groupInviteRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);
app.use(notFound);
app.use(errorHandler);

module.exports = app;