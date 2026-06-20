import {
  useEffect,
  useState,
  useRef,
} from "react";

import api from "../api/axios";
import InvitePanel
from "../components/InvitePanel";

import UserSearch
from "../components/UserSearch";

import GroupMembers
from "../components/GroupMembers";

import {
  connectSocket,
} from "../socket";

function GroupChat() {
  const [groups, setGroups] =
    useState([]);

  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState(null);

  const [messages, setMessages] =
    useState([]);

  const [content, setContent] =
    useState("");

  const [
    groupName,
    setGroupName,
  ] = useState("");

  const [onlineUsers,
    setOnlineUsers] =
    useState([]);

  const messagesEndRef =
    useRef(null);

  const token =
    localStorage.getItem(
      "token"
    );

  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  // =====================
  // AUTO SCROLL
  // =====================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =====================
  // LOAD GROUPS
  // =====================

  const loadGroups =
    async () => {
      try {
        const res =
          await api.get(
            "/groups",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setGroups(
          res.data
        );
      } catch (error) {
        console.log(
          error
        );
      }
    };

  // =====================
  // CREATE GROUP
  // =====================

  const createGroup =
    async () => {
      if (
        !groupName.trim()
      )
        return;

      try {
        const res =
  await api.post(
    "/groups",
    {
      name: groupName,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

setSelectedGroup(
  res.data
);

setGroupName("");

loadGroups();
      } catch (error) {
        console.log(
          error
        );
      }
    };

  // =====================
  // JOIN GROUP
  // =====================

  // const joinGroup =
  //   async (
  //     groupId
  //   ) => {
  //     try {
  //       await api.post(
  //         "/groups/join",
  //         {
  //           groupId,
  //         },
  //         {
  //           headers: {
  //             Authorization:
  //               `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       loadGroups();
  //     } catch (error) {
  //       console.log(
  //         error
  //       );
  //     }
  //   };

  // =====================
  // LOAD MESSAGES
  // =====================

  const loadMessages =
    async (
      groupId
    ) => {
      try {
        const res =
          await api.get(
            `/group-messages/${groupId}`,
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
      } catch (error) {
        console.log(
          error
        );
      }
    };

  // =====================
  // SEND MESSAGE
  // =====================

  const sendMessage =
    async () => {
      if (
        !content.trim() ||
        !selectedGroup
      )
        return;

      try {
        const res =
          await api.post(
            "/group-messages",
            {
              groupId:
                selectedGroup._id,
              content:
                content.trim(),
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
          "group-message",
          {
            ...res.data,
            groupId:
              selectedGroup._id,
          }
        );

        setContent("");
      } catch (error) {
        console.log(
          error
        );
      }
    };

  // =====================
  // OPEN GROUP
  // =====================

  const openGroup =
    (
      group
    ) => {
      const socket =
        connectSocket();

      socket.emit(
        "join-group",
        group._id
      );

      setSelectedGroup(
        group
      );

      loadMessages(
        group._id
      );
    };

  // =====================
  // INITIAL LOAD
  // =====================

  useEffect(() => {
    loadGroups();
  }, []);

  // =====================
  // RECEIVE GROUP MESSAGE
  // =====================

  useEffect(() => {
    const socket =
      connectSocket();

    socket.on(
      "receive-group-message",
      (
        message
      ) => {
        if (
          selectedGroup &&
          message.groupId ===
            selectedGroup._id
        ) {
          setMessages(
            (prev) => [
              ...prev,
              message,
            ]
          );
        }
      }
    );

    return () => {
      socket.off(
        "receive-group-message"
      );
    };
  }, [selectedGroup]);

  // =====================
  // ONLINE USERS
  // =====================

  useEffect(() => {
    const socket =
      connectSocket();

    socket.on(
      "online-users",
      (
        users
      ) => {
        setOnlineUsers(
          users
        );
      }
    );

    return () => {
      socket.off(
        "online-users"
      );
    };
  }, []);

  return (
    <div className="container-fluid">
      <div className="row vh-100">

        {/* SIDEBAR */}

        <div className="col-3 border-end p-3">

          <h4>
            Groups
          </h4>

          <h6 className="text-success mb-3">
            Online Users:
            {" "}
            {
              onlineUsers.length
            }
          </h6>

          <div className="d-flex gap-2 mb-3">

            <input
              className="form-control"
              value={
                groupName
              }
              onChange={(
                e
              ) =>
                setGroupName(
                  e.target
                    .value
                )
              }
              placeholder="Group Name"
            />

            <button
              className="btn btn-primary"
              onClick={
                createGroup
              }
            >
              Create
            </button>
          </div>

          {groups.map(
            (
              group
            ) => (
              <div
                key={
                  group._id
                }
                className="border rounded p-2 mb-2"
              >
                <div
                  style={{
                    cursor:
                      "pointer",
                  }}
                  onClick={() =>
                    openGroup(
                      group
                    )
                  }
                >
                  <strong>
                    {
                      group.name
                    }
                  </strong>

                  <div
                    className="text-muted"
                    style={{
                      fontSize:
                        "12px",
                    }}
                  >
                    Members:
                    {" "}
                    {group
                      .members
                      ?.length ||
                      0}
                  </div>
                </div>

                {/* <button
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={() =>
                    joinGroup(
                      group._id
                    )
                  }
                >
                  Join
                </button> */}
              </div>
            )
          )}
          <InvitePanel
            onInviteAction={
              loadGroups
            }
          />
        </div>

        {/* CHAT AREA */}

        <div className="col-9 p-3 d-flex flex-column">

          {selectedGroup ? (
            <>
              <h3>
                {
                  selectedGroup.name
                }
              </h3>
                <UserSearch
                  selectedGroup={
                    selectedGroup
                  }
                />
                <GroupMembers
                  selectedGroup={
                    selectedGroup
                  }
                />
              <div
                className="flex-grow-1 border rounded p-3 mt-3"
                style={{
                  overflowY:
                    "auto",
                  background:
                    "#f8f9fa",
                }}
              >
                {messages.map(
                  (
                    msg,
                    index
                  ) => {
                    const isMine =
                      msg.sender ===
                        currentUser.id ||
                      msg.sender
                        ?._id ===
                        currentUser.id;

                    return (
                      <div
                        key={
                          index
                        }
                        className={`d-flex mb-2 ${
                          isMine
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >
                        <div
                          className={`p-2 rounded shadow-sm ${
                            isMine
                              ? "bg-primary text-white"
                              : "bg-white border"
                          }`}
                          style={{
                            maxWidth:
                              "70%",
                          }}
                        >
                          {!isMine && (
                            <small className="fw-bold d-block">
                              {msg
                                .sender
                                ?.name ||
                                "User"}
                            </small>
                          )}

                          <div>
                            {
                              msg.content
                            }
                          </div>

                          <small
                            style={{
                              fontSize:
                                "11px",
                              opacity:
                                0.75,
                            }}
                          >
                            {new Date(
                              msg.createdAt
                            ).toLocaleTimeString(
                              [],
                              {
                                hour:
                                  "2-digit",
                                minute:
                                  "2-digit",
                              }
                            )}
                          </small>
                        </div>
                      </div>
                    );
                  }
                )}

                <div
                  ref={
                    messagesEndRef
                  }
                />
              </div>

              <div className="d-flex gap-2 mt-3">

                <input
                  className="form-control"
                  value={
                    content
                  }
                  onChange={(
                    e
                  ) =>
                    setContent(
                      e.target
                        .value
                    )
                  }
                  placeholder="Type a message..."
                  onKeyDown={(
                    e
                  ) => {
                    if (
                      e.key ===
                      "Enter"
                    ) {
                      sendMessage();
                    }
                  }}
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
            <div className="d-flex justify-content-center align-items-center h-100">
              <h3 className="text-muted">
                Select a Group
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupChat;