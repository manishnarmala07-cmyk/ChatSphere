const onlineUsers = new Map();
global.onlineUsers =
  onlineUsers;
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(
      "User Connected:",
      socket.id
    );

    // ======================
    // ONLINE USERS
    // ======================

    socket.on(
      "user-online",
      (userId) => {
        onlineUsers.set(
          userId,
          socket.id
        );

        io.emit(
          "online-users",
          Array.from(
            onlineUsers.keys()
          )
        );

        console.log(
          "Online Users:",
          Array.from(
            onlineUsers.keys()
          )
        );
      }
    );

    // ======================
    // PRIVATE CHAT
    // ======================

    socket.on(
      "private-message",
      (message) => {
        const receiverSocket =
          onlineUsers.get(
            message.receiver
          );

        if (
          receiverSocket
        ) {
          io.to(
            receiverSocket
          ).emit(
            "receive-message",
            message
          );
        }
      }
    );

    // ======================
    // GROUP CHAT
    // ======================

    socket.on(
      "join-group",
      (groupId) => {
        socket.join(groupId);

        console.log(
          `Socket ${socket.id} joined group ${groupId}`
        );
      }
    );

    socket.on(
      "group-message",
      (message) => {
        io.to(
          message.groupId
        ).emit(
          "receive-group-message",
          message
        );
      }
    );

    // ======================
    // DISCONNECT
    // ======================

    socket.on(
      "disconnect",
      () => {
        for (const [
          userId,
          socketId,
        ] of onlineUsers.entries()) {
          if (
            socketId ===
            socket.id
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

module.exports =
  socketHandler;