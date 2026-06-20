import {
  useEffect,
  useState,
} from "react";

import {
  connectSocket,
} from "../socket";
import {
  Link
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } =
    useAuth();

  const [onlineUsers,
    setOnlineUsers] =
    useState([]);

  useEffect(() => {
  if (!user) return;

  const socket = connectSocket();

  socket.emit(
    "user-online",
    user.id
  );

  socket.on(
    "online-users",
    (users) => {
      setOnlineUsers(users);
    }
  );

  return () => {
    socket.off(
      "online-users"
    );
  };
}, [user]);

  return (
    <div className="container mt-5">
      <h2>
        Welcome {user?.name}
      </h2>
      <Link
        to="/chat"
        className="btn btn-primary me-3"
      >
        Open Chat
      </Link>
      <h4 className="mt-4">
        Online Users:
        {" "}
        {onlineUsers.length}
      </h4>

      <ul>
        {onlineUsers.map(
          (id) => (
            <li key={id}>
              {id}
            </li>
          )
        )}
      </ul>

      <button
        className="btn btn-danger"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;