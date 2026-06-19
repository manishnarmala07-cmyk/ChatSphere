import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      name: "",
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
      await api.post(
        "/auth/register",
        form
      );

      alert(
        "Registration Successful"
      );

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>

      <form
        onSubmit={handleSubmit}
      >
        <input
          className="form-control mb-3"
          placeholder="Name"
          name="name"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="Password"
          type="password"
          name="password"
          onChange={handleChange}
        />

        <button className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;