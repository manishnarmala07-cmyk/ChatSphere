import {
  useEffect,
  useState,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import {
  connectSocket,
} from "../socket";

import {
  useAuth,
} from "../context/AuthContext";


function Chat() {
  const navigate = useNavigate();
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
  const [editingId,
    setEditingId] =
    useState(null);

  const [editContent,
    setEditContent] =
    useState("");
    const [menuOpen,
  setMenuOpen] =
  useState(null);
  
  const token =
    localStorage.getItem(
      "token"
    );

  useEffect(() => {
    loadUsers();
  }, []);
  useEffect(() => {
  if (!user) return;

  const socket =
    connectSocket();

  socket.emit(
    "user-online",
    {
      id: user.id,
      name: user.name,
      username:
        user.username,
    }
  );

  console.log(
    "Registered Online:",
    user.id
  );

}, [user]);

  useEffect(() => {
    if (
      selectedUser
    ) {
      loadMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
  const container =
    document.getElementById(
      "chat-container"
    );

  if (container) {
    container.scrollTop =
      container.scrollHeight;
  }
}, [messages]);

useEffect(() => {
  const socket =
    connectSocket();

  if (user) {
    socket.emit(
      "user-online",
      {
        id: user.id,
        name: user.name,
        username:
          user.username,
      }
    );
  }

  socket.on(
    "connect",
    () => {
      console.log(
        "Socket Connected:",
        socket.id
      );
    }
  );

  socket.on(
    "disconnect",
    () => {
      console.log(
        "Socket Disconnected"
      );
    }
  );

  socket.on(
    "receive-message",
    async (message) => {

      setMessages(
        (prev) => [
          ...prev,
          message,
        ]
      );
      if (
  selectedUser &&
  selectedUser._id ===
    message.sender
) {

  try {

    await api.put(
      `/messages/read/${message._id}`,
      {},
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    socket.emit(
      "message-read",
      {
        senderId:
          message.sender,
        messageId:
          message._id,
      }
    );

  } catch (error) {
    console.log(error);
  }

}
      try {

        await api.put(
          `/messages/delivered/${message._id}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        socket.emit(
          "message-delivered",
          {
            senderId:
              message.sender,
            messageId:
              message._id,
          }
        );

      } catch (error) {
        console.log(error);
      }
    }
  );

  socket.on(
    "message-delivered",
    async () => {

      console.log(
        "Delivered received"
      );

      if (
        selectedUser
      ) {
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
      }
    }
  );

  socket.on(
    "message-read",
    async () => {

      console.log(
        "Read received"
      );

      if (
        selectedUser
      ) {
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
      }
    }
  );

  return () => {

    socket.off(
      "receive-message"
    );

    socket.off(
      "message-delivered"
    );

    socket.off(
      "message-read"
    );

    socket.off(
      "connect"
    );

    socket.off(
      "disconnect"
    );
  };

}, [
  selectedUser,
  token,
  user,
]);

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

    const socket =
      connectSocket();

    for (
      const message
      of res.data
    ) {

      if (
        message.receiver ===
  user.id &&
message.sender ===
  selectedUser._id &&
message.status !==
  "read"
      ) {

        try {

          await api.put(
            `/messages/read/${message._id}`,
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          socket.emit(
            "message-read",
            {
              senderId:
                message.sender,
              messageId:
                message._id,
            }
          );

        } catch (
          error
        ) {
          console.log(
            error
          );
        }
      }
    }
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
  const editMessage =
    async (messageId) => {
      try {
        const res =
          await api.put(
            `/messages/${messageId}`,
            {
              content:
                editContent,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setMessages(
          (prev) =>
            prev.map(
              (msg) =>
                msg._id ===
                messageId
                  ? res.data
                  : msg
            )
        );

        setEditingId(
          null
        );

        setEditContent(
          ""
        );
      } catch (
        error
      ) {
        alert(
          error.response
            ?.data
            ?.message ||
            "Edit failed"
        );
      }
    };
  const deleteForMe =
  async (messageId) => {
    try {
      await api.put(
        `/messages/delete-for-me/${messageId}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setMessages(
        (prev) =>
          prev.filter(
            (msg) =>
              msg._id !==
              messageId
          )
      );
    } catch (error) {
      alert(
        error.response
          ?.data
          ?.message ||
          "Delete failed"
      );
    }
  };

const deleteForEveryone =
  async (messageId) => {
    try {
      await api.put(
        `/messages/delete-for-everyone/${messageId}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      loadMessages();
    } catch (error) {
      alert(
        error.response
          ?.data
          ?.message ||
          "Delete failed"
      );
    }
  };

const deleteForBoth =
  async (messageId) => {
    try {
      await api.delete(
        `/messages/delete-for-both/${messageId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setMessages(
        (prev) =>
          prev.filter(
            (msg) =>
              msg._id !==
              messageId
          )
      );
    } catch (error) {
      alert(
        error.response
          ?.data
          ?.message ||
          "Delete failed"
      );
    }
  };
    const canEdit =
  (message) => {
    const tenMinutes =
      10 *
      60 *
      1000;

    return (
      message.sender ===
        user.id &&
      Date.now() -
        new Date(
          message.createdAt
        ).getTime() <
        tenMinutes
    );
  };
  return (
    <div className="container-fluid">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/dashboard")}
      >
        ← Back
      </button>
      <div className="row vh-100">
        <div className="col-3 border-end p-3">
          <h4>Users</h4>

          {users.map(
            (u) => (
              <div
              key={u._id}
              className={`p-2 border mb-2 rounded ${
                selectedUser?._id ===
                u._id
                  ? "bg-primary text-white"
                  : "bg-light"
              }`}
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
                <div>
  <strong className="text-primary">
    {u.username}
  </strong>

  <br />

  <small >
    {u.name}
  </small>
</div>
              </div>
            )
          )}
        </div>

        <div className="col-9 p-3">

          {selectedUser ? (
            <>
              <div className="border-bottom pb-2 mb-3">
                <h4>👤 {selectedUser.name}</h4>
                <small className="text-success">Online</small>
              </div>

              <div
                id="chat-container"
                style={{
                  height: "70vh",
                  overflowY: "auto",
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
                      {editingId ===
msg._id ? (
  <>
    <input
      className="form-control d-inline w-50"
      value={
        editContent
      }
      onChange={(
        e
      ) =>
        setEditContent(
          e.target
            .value
        )
      }
    />

    <button
      className="btn btn-success btn-sm ms-2"
      onClick={() =>
        editMessage(
          msg._id
        )
      }
    >
      Save
    </button>

    <button
      className="btn btn-secondary btn-sm ms-2"
      onClick={() =>
        setEditingId(
          null
        )
      }
    >
      Cancel
    </button>
  </>
) : (
  <>
    <div>
  <div
  className={`d-inline-block p-2 rounded ${
    msg.sender === user.id
      ? "bg-primary text-white"
      : "bg-light border"
  }`}
  style={{
    maxWidth: "60%",
    marginRight: msg.sender === user.id ? "15px" : undefined,
  }}
>
    {msg.content}

    {msg.edited && (
      <small>
        {" "}
        (edited)
      </small>
    )}
  </div>

  <div
  className={
    msg.sender === user.id
      ? "text-end"
      : "text-start"
  }
>
    <small className={`text-muted ${msg.sender === user.id && msg.status === "read" ? "text-primary" : ""}`}>
      {new Date(
        msg.createdAt
      ).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}
      {msg.sender === user.id && (
        " " +
        (msg.status === "sent"
          ? "✓"
          : msg.status === "delivered"
          ? "✓✓"
          : msg.status === "read"
          ? "✓✓"
          : "")
      )}
    </small>
  </div>
</div>
    {msg.sender ===
  user.id && (
  <div
    className="d-inline-block position-relative ms-2"
  >
    <button
      className="btn btn-secondary btn-sm"
      onClick={() =>
        setMenuOpen(
          menuOpen ===
            msg._id
            ? null
            : msg._id
        )
      }
    >
      ⋮
    </button>

    {menuOpen ===
      msg._id && (
      <div
        className="position-absolute bg-white border p-2"
        style={{
          right: 0,
          zIndex: 1000,
          minWidth:
            "180px",
        }}
      >
        {canEdit(
          msg
        ) && (
          <button
            className="dropdown-item"
            onClick={() => {
              setEditingId(
                msg._id
              );

              setEditContent(
                msg.content
              );

              setMenuOpen(
                null
              );
            }}
          >
            ✏ Edit
          </button>
        )}

        <button
          className="dropdown-item"
          onClick={() =>
            deleteForMe(
              msg._id
            )
          }
        >
          Delete For Me
        </button>

        <button
          className="dropdown-item"
          onClick={() =>
            deleteForEveryone(
              msg._id
            )
          }
        >
          Delete For Everyone
        </button>

        <button
          className="dropdown-item text-danger"
          onClick={() =>
            deleteForBoth(
              msg._id
            )
          }
        >
          Delete For Both
        </button>
      </div>
    )}
  </div>
)}
  </>
)}
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
                  className="btn btn-primary px-3"
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