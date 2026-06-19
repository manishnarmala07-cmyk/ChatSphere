require("dotenv").config();

const http = require("http");

const app = require("./src/app");

const connectDB =
  require("./src/config/db");

const socketHandler =
  require("./src/sockets/socketHandler");

const { Server } =
  require("socket.io");

connectDB();

const server =
  http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      "http://localhost:5173",
    methods: [
      "GET",
      "POST",
    ],
  },
});

socketHandler(io);

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});