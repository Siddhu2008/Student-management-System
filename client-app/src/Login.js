import React, { useState } from "react";
import axios from "axios";

// ...existing imports...

function Login({ setToken, setUser }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const url = isRegister
        ? "http://localhost:5000/register"
        : "http://localhost:5000/login";
      // Always send role
      const payload = { ...form };
      const res = await axios.post(url, payload);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        // Fetch user info
        const userRes = await axios.get("http://localhost:5000/me", {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });
        setUser(userRes.data);
      } else if (res.data.message) {
        setIsRegister(false);
        setError("");
        alert("Registration successful! Please log in.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 60 }}>
      <div className="card shadow p-4">
        <h3 className="mb-3 text-center">
          {isRegister ? "Register" : "Login"}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            className="form-control mb-2"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {/* Show role select for both login and register */}
          <select
            name="role"
            className="form-control mb-3"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {error && <div className="alert alert-danger py-1">{error}</div>}
          <button className="btn btn-primary w-100 mb-2" type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <button
          className="btn btn-link w-100"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}

export default Login;