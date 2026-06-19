const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(
      "User Connected:",
      socket.id
    );

    socket.on("user-online", (userId) => {
  console.log("Received user-online:", userId);

  onlineUsers.set(userId, socket.id);

  console.log(
    "Current online users:",
    Array.from(onlineUsers.keys())
  );

  io.emit(
    "online-users",
    Array.from(onlineUsers.keys())
  );
});

    socket.on(
      "disconnect",
      () => {
        for (const [
          userId,
          socketId,
        ] of onlineUsers.entries()) {
          if (
            socketId === socket.id
          ) {
            onlineUsers.delete(
              userId
            );
            break;
          }
        }

        io.emit(
          "online-users",
          Array.from(
            onlineUsers.keys()
          )
        );

        console.log(
          "Disconnected:",
          socket.id
        );
      }
    );
  });
};

module.exports = socketHandler;