import { useState } from "react";
import api from "../api/axios";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  GoogleLogin,
} from "@react-oauth/google";

function Login() {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [form,
    setForm] =
    useState({
      email: "",
      password: "",
    });

  const handleChange =
    (e) => {
      setForm({
        ...form,
        [e.target.name]:
          e.target.value,
      });
    };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const res =
          await api.post(
            "/auth/login",
            form
          );

        login(
          res.data.user,
          res.data.token
        );

        navigate(
          "/dashboard"
        );
      } catch (error) {
        alert(
          error.response
            ?.data
            ?.message ||
            "Login Failed"
        );
      }
    };

  const handleGoogleLogin =
    async (
      credentialResponse
    ) => {
      try {
        const res =
          await api.post(
            "/auth/google",
            {
              credential:
                credentialResponse.credential,
            }
          );

        login(
          res.data.user,
          res.data.token
        );

        navigate(
          "/dashboard"
        );
      } catch (error) {
        console.error(
          error
        );

        alert(
          "Google Login Failed"
        );
      }
    };

  return (
    <div className="container mt-5">

      <h2>
        Login
      </h2>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          className="form-control mb-3"
          placeholder="Email"
          name="email"
          value={
            form.email
          }
          onChange={
            handleChange
          }
          required
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          name="password"
          value={
            form.password
          }
          onChange={
            handleChange
          }
          required
        />

        <button
          className="btn btn-success"
          type="submit"
        >
          Login
        </button>

        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </form>

      <hr />

      <div className="d-flex justify-content-center">

        <GoogleLogin
          onSuccess={
            handleGoogleLogin
          }
          onError={() => {
            alert(
              "Google Login Failed"
            );
          }}
        />

      </div>

    </div>
  );
}

export default Login;