const onlineUsers =
  new Map();

global.onlineUsers =
  onlineUsers;

const socketHandler =
  (io) => {

    io.on(
      "connection",
      (socket) => {

        console.log(
          "User Connected:",
          socket.id
        );

        // ======================
        // ONLINE USERS
        // ======================

        socket.on(
          "user-online",
          (userData) => {

            onlineUsers.set(
              userData.id,
              {
                socketId:
                  socket.id,
                name:
                  userData.name,
                username:
                  userData.username,
              }
            );

            io.emit(
              "online-users",
              Array.from(
                onlineUsers.entries()
              ).map(
                ([id, data]) => ({
                  id,
                  ...data,
                })
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

            const receiver =
              onlineUsers.get(
                message.receiver
              );

            if (
              receiver
            ) {

              io.to(
                receiver.socketId
              ).emit(
                "receive-message",
                message
              );

            }
            console.log(
  "Received:",
  message
);
          }
          
        );

        // ======================
        // MESSAGE DELIVERED
        // ======================

        socket.on(
          "message-delivered",
          ({
            senderId,
            messageId,
          }) => {

            console.log(
              "Delivered Event:",
              senderId,
              messageId
            );

            const sender =
              onlineUsers.get(
                senderId
              );

            if (
              sender
            ) {

              io.to(
                sender.socketId
              ).emit(
                "message-delivered",
                messageId
              );

            }
          }
        );

        // ======================
        // MESSAGE READ
        // ======================

        socket.on(
          "message-read",
          ({
            senderId,
            messageId,
          }) => {

            console.log(
              "Read Event:",
              senderId,
              messageId
            );

            const sender =
              onlineUsers.get(
                senderId
              );

            if (
              sender
            ) {

              io.to(
                sender.socketId
              ).emit(
                "message-read",
                messageId
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

            socket.join(
              groupId
            );

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

            for (
              const [
                userId,
                userData,
              ] of onlineUsers.entries()
            ) {

              if (
                userData.socketId ===
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
                onlineUsers.entries()
              ).map(
                ([id, data]) => ({
                  id,
                  ...data,
                })
              )
            );

            console.log(
              "Disconnected:",
              socket.id
            );
          }
        );

      }
    );

  };

module.exports =
  socketHandler;