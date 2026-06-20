import {
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

function AdminDashboard() {
  const [stats,
    setStats] =
    useState(null);

  const adminToken =
    localStorage.getItem(
      "adminToken"
    );

  const loadStats =
    async () => {
      try {
        const res =
          await api.get(
            "/admin/stats",
            {
              headers: {
                Authorization:
                  `Bearer ${adminToken}`,
              },
            }
          );

        setStats(
          res.data
        );
      } catch (
        error
      ) {
        console.log(
          error
        );
      }
    };

  useEffect(() => {
    loadStats();

    const interval =
      setInterval(
        loadStats,
        5000
      );

    return () =>
      clearInterval(
        interval
      );
  }, []);

  if (!stats)
    return (
      <h3 className="text-center mt-5">
        Loading...
      </h3>
    );

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        ChatSphere Admin Dashboard
      </h2>

      <div className="row g-4">

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>
                Users
              </h5>
              <h2>
                {
                  stats.users
                }
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>
                Online Users
              </h5>
              <h2>
                {
                  stats.onlineUsers
                }
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>
                Groups
              </h5>
              <h2>
                {
                  stats.groups
                }
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>
                Private Messages
              </h5>
              <h2>
                {
                  stats.privateMessages
                }
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>
                Group Messages
              </h5>
              <h2>
                {
                  stats.groupMessages
                }
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>
                Pending Invites
              </h5>
              <h2>
                {
                  stats.pendingInvites
                }
              </h2>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;