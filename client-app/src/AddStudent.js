import React, { useState } from "react";
import axios from "axios";

function AddStudent({ token, fetchStudents, theme = "light" }) {
  const [form, setForm] = useState({ name: "", age: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:5000/students", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", age: "", email: "" });
      setSuccess("Student added successfully!");
      if (fetchStudents) fetchStudents();
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
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "90vh",
        // background removed for transparent/parent background
        transition: "background 0.5s",
      }}
    >
      <div
        className={`card shadow-lg p-5 animate__animated animate__fadeIn`}
        style={{
          maxWidth: 520,
          width: "100%",
          background: theme === "dark" ? "#232a36" : "#fff",
          border: theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
          borderRadius: 20,
        }}
      >
        <h3 className="mb-2 text-center" style={{ fontWeight: 700 }}>
          Add Student
        </h3>
        <hr className="mb-4" style={{ opacity: 0.2 }} />
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form className="row g-3" onSubmit={handleSubmit} autoComplete="off">
          <div className="col-12">
            <div className="form-floating">
              <input
                name="name"
                className={`form-control ${
                  theme === "dark" ? "bg-dark text-light border-secondary" : ""
                }`}
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                id="studentName"
              />
              <label htmlFor="studentName">
                <i className="bi bi-person me-2"></i>Name
              </label>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-floating">
              <input
                name="age"
                type="number"
                className={`form-control ${
                  theme === "dark" ? "bg-dark text-light border-secondary" : ""
                }`}
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                required
                min={1}
                id="studentAge"
              />
              <label htmlFor="studentAge">
                <i className="bi bi-123 me-2"></i>Age
              </label>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-floating">
              <input
                name="email"
                type="email"
                className={`form-control ${
                  theme === "dark" ? "bg-dark text-light border-secondary" : ""
                }`}
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                id="studentEmail"
              />
              <label htmlFor="studentEmail">
                <i className="bi bi-envelope me-2"></i>Email
              </label>
            </div>
          </div>
          <div className="col-12 d-grid mt-3">
            <button
              type="submit"
              className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2"
              style={{ minHeight: 48, fontWeight: 600, fontSize: 18 }}
            >
              <i className="bi bi-plus-circle"></i>
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
