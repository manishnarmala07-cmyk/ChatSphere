import { useEffect, useState } from "react";
import api from "../api/axios";

function GroupMembers({ selectedGroup }) {
  const [group, setGroup] =
    useState(null);

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

  const loadGroup =
    async () => {
      if (!selectedGroup)
        return;

      const res =
        await api.get(
          `/groups/details/${selectedGroup._id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setGroup(
        res.data
      );
    };

  useEffect(() => {
    loadGroup();
  }, [selectedGroup]);

  const leaveGroup =
    async () => {
      await api.put(
        `/groups/leave/${selectedGroup._id}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        "Left group"
      );

      window.location.reload();
    };

  const removeMember =
    async (
      memberId
    ) => {
      await api.put(
        `/groups/remove/${selectedGroup._id}`,
        {
          memberId,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      loadGroup();
    };

  if (!group)
    return null;

  const isCreator =
    group.createdBy
      ?._id ===
    currentUser.id;

  return (
    <div className="border rounded p-3 mt-3">

      <div className="d-flex justify-content-between align-items-center">

        <h5>
          Members (
          {
            group.members
              ?.length
          }
          )
        </h5>

        <button
          className="btn btn-danger btn-sm"
          onClick={
            leaveGroup
          }
        >
          Leave Group
        </button>

      </div>

      <div className="mt-3">

        {group.members.map(
          (
            member
          ) => (
            <div
              key={
                member._id
              }
              className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center"
            >
              <div>

                <strong>
                  {
                    member.name
                  }
                </strong>

                {group
                  .createdBy
                  ?._id ===
                  member._id && (
                  <span className="ms-2 badge bg-warning text-dark">
                    Creator
                  </span>
                )}

                <div>
                  <small>
                    {
                      member.email
                    }
                  </small>
                </div>

              </div>

              {isCreator &&
                member._id !==
                  currentUser.id && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() =>
                      removeMember(
                        member._id
                      )
                    }
                  >
                    Remove
                  </button>
                )}

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default GroupMembers;