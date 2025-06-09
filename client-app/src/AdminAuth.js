import React, { useState } from "react";
import axios from "axios";

function AdminAuth({ setToken, setUser }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      if (isRegister) {
        // Admin registration
        await axios.post("http://localhost:5000/register", {
          ...form,
          role: "admin",
        });
        setMessage("Admin registered successfully! Please log in.");
        setIsRegister(false);
        setForm({ username: "", password: "" });
      } else {
        // Admin login
        const res = await axios.post("http://localhost:5000/login", form);
        if (res.data.token) {
          // Fetch user info
          const userRes = await axios.get("http://localhost:5000/me", {
            headers: { Authorization: `Bearer ${res.data.token}` },
          });
          if (userRes.data.role !== "admin") {
            setError("You are not an admin.");
            return;
          }
          localStorage.setItem("token", res.data.token);
          setToken(res.data.token);
          setUser(userRes.data);
        } else {
          setError("Invalid credentials");
        }
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
          {isRegister ? "Admin Register" : "Admin Login"}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            className="form-control mb-2"
            placeholder="Admin Username"
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
          {error && <div className="alert alert-danger py-1">{error}</div>}
          {message && <div className="alert alert-success py-1">{message}</div>}
          <button className="btn btn-warning w-100 mb-2" type="submit">
            {isRegister ? "Register as Admin" : "Login as Admin"}
          </button>
        </form>
        <button
          className="btn btn-link w-100"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setMessage("");
          }}
        >
          {isRegister
            ? "Already have an admin account? Login"
            : "Don't have an admin account? Register"}
        </button>
      </div>
    </div>
  );
}

export default AdminAuth;
