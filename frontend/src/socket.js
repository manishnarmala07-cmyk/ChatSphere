import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL =
  import.meta.env
    .VITE_SOCKET_URL ||
  "http://localhost:5000";

export const connectSocket = () => {
  if (!socket) {
    socket = io(
      SOCKET_URL,
      {
        transports: [
          "websocket",
          "polling",
        ],
      }
    );
  }

  return socket;
};

export const getSocket =
  () => socket;

export const disconnectSocket =
  () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };