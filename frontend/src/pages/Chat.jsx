import {
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

import {
  connectSocket,
} from "../socket";

import {
  useAuth,
} from "../context/AuthContext";

function Chat() {
  const { user } =
    useAuth();

  const [users,
    setUsers] =
    useState([]);

  const [selectedUser,
    setSelectedUser] =
    useState(null);

  const [messages,
    setMessages] =
    useState([]);

  const [content,
    setContent] =
    useState("");

  const token =
    localStorage.getItem(
      "token"
    );

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (
      selectedUser
    ) {
      loadMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    const socket =
      connectSocket();

    socket.on(
      "receive-message",
      (message) => {
        setMessages(
          (prev) => [
            ...prev,
            message,
          ]
        );
      }
    );

    return () => {
      socket.off(
        "receive-message"
      );
    };
  }, []);

  const loadUsers =
    async () => {
      const res =
        await api.get(
          "/auth/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setUsers(res.data);
    };

  const loadMessages =
    async () => {
      const res =
        await api.get(
          `/messages/${selectedUser._id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setMessages(
        res.data
      );
    };

  const sendMessage =
    async () => {
      if (
        !content.trim()
      )
        return;

      const res =
        await api.post(
          "/messages",
          {
            receiver:
              selectedUser._id,
            content,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const socket =
        connectSocket();

      socket.emit(
        "private-message",
        {
          ...res.data,
          receiver:
            selectedUser._id,
        }
      );

      setMessages(
        (prev) => [
          ...prev,
          res.data,
        ]
      );

      setContent("");
    };

  return (
    <div className="container-fluid">
      <div className="row vh-100">

        <div className="col-3 border-end p-3">
          <h4>Users</h4>

          {users.map(
            (u) => (
              <div
                key={
                  u._id
                }
                className="p-2 border mb-2"
                style={{
                  cursor:
                    "pointer",
                }}
                onClick={() =>
                  setSelectedUser(
                    u
                  )
                }
              >
                {u.name}
              </div>
            )
          )}
        </div>

        <div className="col-9 p-3">

          {selectedUser ? (
            <>
              <h4>
                Chat with{" "}
                {
                  selectedUser.name
                }
              </h4>

              <div
                style={{
                  height:
                    "70vh",
                  overflowY:
                    "auto",
                }}
              >
                {messages.map(
                  (
                    msg,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className={`mb-2 ${
                        msg.sender ===
                        user.id
                          ? "text-end"
                          : "text-start"
                      }`}
                    >
                      <span
                        className="badge bg-primary"
                      >
                        {
                          msg.content
                        }
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="d-flex gap-2">
                <input
                  className="form-control"
                  value={
                    content
                  }
                  onChange={(
                    e
                  ) =>
                    setContent(
                      e
                        .target
                        .value
                    )
                  }
                />

                <button
                  className="btn btn-success"
                  onClick={
                    sendMessage
                  }
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <h3>
              Select a user
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;