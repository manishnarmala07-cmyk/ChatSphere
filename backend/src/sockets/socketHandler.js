const onlineUsers =
  new Map();

const socketHandler = (
  io
) => {
  io.on(
    "connection",
    (socket) => {
      console.log(
        "User Connected:",
        socket.id
      );

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
        }
      );

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
        }
      );
    }
  );
};

module.exports =
  socketHandler;