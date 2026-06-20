import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function AdminLogin() {
  const [secret,
    setSecret] =
    useState("");

  // Auto redirect if already logged in
  useEffect(() => {
    if (
      localStorage.getItem(
        "adminToken"
      )
    ) {
      window.location.href =
        "/admin-dashboard";
    }
  }, []);

  const handleLogin =
    async () => {
      try {
        const res =
          await axios.post(
            "http://localhost:5000/api/admin/login",
            {
              secret,
            }
          );

        localStorage.setItem(
          "adminToken",
          res.data.token
        );

        window.location.href =
          "/admin-dashboard";
      } catch (
        error
      ) {
        alert(
          "Invalid Secret"
        );
      }
    };

  return (
    <div className="container mt-5">

      <div
        className="card mx-auto shadow"
        style={{
          maxWidth:
            "500px",
        }}
      >
        <div className="card-body">

          <h2 className="text-center mb-4">
            Admin Login
          </h2>

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter Admin Secret"
            value={secret}
            onChange={(e) =>
              setSecret(
                e.target
                  .value
              )
            }
          />

          <button
            className="btn btn-primary w-100"
            onClick={
              handleLogin
            }
          >
            Login
          </button>

        </div>
      </div>

    </div>
  );
}

export default AdminLogin;