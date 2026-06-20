import { useState } from "react";
import api from "../api/axios";

function UserSearch({
  selectedGroup,
}) {
  const [query, setQuery] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const token =
    localStorage.getItem(
      "token"
    );

  const searchUsers =
    async () => {
      if (
        !query.trim()
      )
        return;

      const res =
        await api.get(
          `/auth/search?q=${query}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setUsers(
        res.data
      );
    };

  const inviteUser =
    async (
      userId
    ) => {
      await api.post(
        "/group-invites",
        {
          groupId:
            selectedGroup._id,
          receiver:
            userId,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        "Invitation sent"
      );
    };

  return (
    <div className="border rounded p-3 mt-3">

      <h5>
        Invite Member
      </h5>

      <div className="d-flex gap-2">

        <input
          className="form-control"
          placeholder="Search User"
          value={query}
          onChange={(
            e
          ) =>
            setQuery(
              e.target
                .value
            )
          }
        />

        <button
          className="btn btn-primary"
          onClick={
            searchUsers
          }
        >
          Search
        </button>

      </div>

      <div className="mt-3">

        {users.map(
          (
            user
          ) => (
            <div
              key={
                user._id
              }
              className="border p-2 rounded mb-2 d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>
                  {
                    user.name
                  }
                </strong>
                <br />
                <small>
                  {
                    user.email
                  }
                </small>
              </div>

              <button
                className="btn btn-success btn-sm"
                onClick={() =>
                  inviteUser(
                    user._id
                  )
                }
              >
                Invite
              </button>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default UserSearch;