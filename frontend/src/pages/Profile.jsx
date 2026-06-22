import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem(
      "token"
    );

  const [profile,
    setProfile] =
    useState(null);

  const [username,
    setUsername] =
    useState("");

  const [currentPassword,
    setCurrentPassword] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile =
    async () => {
      try {

        const res =
          await api.get(
            "/auth/profile",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setProfile(
          res.data.user
        );

        setUsername(
          res.data.user
            .username
        );

      } catch (error) {
        console.log(error);
      }
    };

  const updateUsername =
    async () => {

      try {

        await api.put(
          "/auth/username",
          {
            username,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Username updated successfully"
        );

        loadProfile();

      } catch (error) {

        alert(
          error.response
            ?.data
            ?.message ||
            "Failed to update username"
        );

      }
    };

  const changePassword =
    async () => {

      if (
        newPassword !==
        confirmPassword
      ) {

        return alert(
          "Passwords do not match"
        );

      }

      try {

        await api.put(
          "/auth/password",
          {
            currentPassword,
            newPassword,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Password updated successfully"
        );

        setCurrentPassword(
          ""
        );

        setNewPassword(
          ""
        );

        setConfirmPassword(
          ""
        );

      } catch (error) {

        alert(
          error.response
            ?.data
            ?.message ||
            "Failed to change password"
        );

      }
    };

  if (!profile) {
    return (
      <h3 className="text-center mt-5">
        Loading...
      </h3>
    );
  }

  return (
    <div className="container mt-4">

      <button
        className="btn btn-secondary mb-3"
        onClick={() =>
          navigate(
            "/dashboard"
          )
        }
      >
        ← Back
      </button>

      <h2>
        Profile
      </h2>

      <div className="card p-3 mb-4">

        <h5>
          Name
        </h5>

        <input
          className="form-control mb-3"
          value={
            profile.name
          }
          disabled
        />

        <h5>
          Email
        </h5>

        <input
          className="form-control"
          value={
            profile.email
          }
          disabled
        />

      </div>

      <div className="card p-3 mb-4">

        <h5>
          Change Username
        </h5>

        <input
          className="form-control mb-3"
          value={
            username
          }
          onChange={(e) =>
            setUsername(
              e.target
                .value
            )
          }
        />

        <button
          className="btn btn-primary"
          onClick={
            updateUsername
          }
        >
          Update Username
        </button>

      </div>

      <div className="card p-3">

        <h5>
          Change Password
        </h5>

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Current Password"
          value={
            currentPassword
          }
          onChange={(e) =>
            setCurrentPassword(
              e.target
                .value
            )
          }
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="New Password"
          value={
            newPassword
          }
          onChange={(e) =>
            setNewPassword(
              e.target
                .value
            )
          }
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          value={
            confirmPassword
          }
          onChange={(e) =>
            setConfirmPassword(
              e.target
                .value
            )
          }
        />

        <button
          className="btn btn-warning"
          onClick={
            changePassword
          }
        >
          Change Password
        </button>

      </div>

    </div>
  );
}

export default Profile;