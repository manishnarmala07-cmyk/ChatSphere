import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
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

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>

      <form
        onSubmit={handleSubmit}
      >
        <input
          className="form-control mb-3"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />

        <button className="btn btn-success">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;