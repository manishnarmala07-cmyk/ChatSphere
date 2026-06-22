import { useState } from "react";
import api from "../api/axios";
import {
  useNavigate,
  Link,
} from "react-router-dom";

function Register() {
  const navigate =
    useNavigate();

  const [error,
    setError] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [form,
    setForm] =
    useState({
      name: "",
      username: "",
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

      setError("");

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (
        !emailRegex.test(
          form.email
        )
      ) {
        setError(
          "Invalid email format"
        );
        return;
      }

      if (
        !passwordRegex.test(
          form.password
        )
      ) {
        setError(
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number"
        );
        return;
      }

      try {
        setLoading(true);

        sessionStorage.setItem(
          "pendingUser",
          JSON.stringify(form)
        );

        await api.post(
          "/otp/send",
          {
            email:
              form.email,
          }
        );

        alert(
          "OTP sent to your email"
        );

        navigate(
          "/verify-otp"
        );
      } catch (error) {
        setError(
          error.response
            ?.data
            ?.message ||
            "Failed to send OTP"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="container mt-5">

      <h2>
        Register
      </h2>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form
        onSubmit={
          handleSubmit
        }
      >

        <input
          className="form-control mb-3"
          placeholder="Name"
          name="name"
          value={
            form.name
          }
          onChange={
            handleChange
          }
          required
        />

        <input
          className="form-control mb-3"
          placeholder="Username"
          name="username"
          value={
            form.username
          }
          onChange={
            handleChange
          }
          required
        />

        <input
          className="form-control mb-3"
          placeholder="Email"
          type="email"
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
          placeholder="Password"
          type="password"
          name="password"
          value={
            form.password
          }
          onChange={
            handleChange
          }
          required
        />

        <div className="mb-3">
          <small className="text-muted">
            Password must contain:
            <br />
            • Minimum 8 characters
            <br />
            • One uppercase letter
            <br />
            • One lowercase letter
            <br />
            • One number
          </small>
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Sending OTP..."
            : "Register"}
        </button>
            <p className="mt-3 text-center">
  <Link to="/">
    Back to Home
  </Link>
</p>
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Register;