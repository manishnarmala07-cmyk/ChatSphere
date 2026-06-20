import { useEffect, useState } from "react";
import api from "../api/axios";

function InvitePanel() {
  const [invites, setInvites] =
    useState([]);

  const token =
    localStorage.getItem(
      "token"
    );

  const loadInvites =
    async () => {
      try {
        const res =
          await api.get(
            "/group-invites",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setInvites(
          res.data
        );
      } catch (error) {
        console.error(
          error
        );
      }
    };

  useEffect(() => {
    loadInvites();
  }, []);

  const acceptInvite =
    async (id) => {
      await api.put(
        `/group-invites/accept/${id}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      loadInvites();
    };

  const rejectInvite =
    async (id) => {
      await api.put(
        `/group-invites/reject/${id}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      loadInvites();
    };

  return (
    <div className="mt-4">

      <h5>
        Invitations
      </h5>

      {invites.length ===
      0 ? (
        <p className="text-muted">
          No pending invites
        </p>
      ) : (
        invites.map(
          (invite) => (
            <div
              key={
                invite._id
              }
              className="border rounded p-2 mb-2"
            >
              <div>
                <strong>
                  {
                    invite
                      .sender
                      ?.name
                  }
                </strong>
                {" "}
                invited you to
              </div>

              <div>
                <strong>
                  {
                    invite
                      .groupId
                      ?.name
                  }
                </strong>
              </div>

              <div className="mt-2 d-flex gap-2">

                <button
                  className="btn btn-success btn-sm"
                  onClick={() =>
                    acceptInvite(
                      invite._id
                    )
                  }
                >
                  Accept
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    rejectInvite(
                      invite._id
                    )
                  }
                >
                  Reject
                </button>

              </div>
            </div>
          )
        )
      )}
    </div>
  );
}

export default InvitePanel;