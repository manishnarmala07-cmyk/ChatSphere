import {
  useEffect,
  useState,
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
    <span
      className="badge bg-primary"
    >
      {msg.content}

      {msg.edited && (
        <small>
          {" "}
          (edited)
        </small>
      )}
    </span>

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