import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentList({
  students,
  user,
  page,
  limit,
  search,
  setSearch,
  setPage,
  token,
  fetchStudents,
}) {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await axios.delete(`http://localhost:5000/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
    }
  };

  // ...existing code...
  return (
    <div className="card shadow p-4">
      <h4 className="mb-3">Students</h4>
      <div className="row align-items-center mb-3 g-2">
        <div className="col-md-8 col-12">
          <div className="input-group">
            <span
              className={`input-group-text ${
                user && user.theme === "dark"
                  ? "bg-dark text-light border-secondary"
                  : "bg-white text-secondary"
              }`}
              style={{ borderRight: 0 }}
            >
              <i className="bi bi-search"></i>
            </span>
            <input
              className={`form-control ${
                user && user.theme === "dark"
                  ? "bg-dark text-light border-secondary"
                  : ""
              }`}
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                minWidth: 180,
                fontSize: 16,
                borderLeft: 0,
              }}
            />
          </div>
        </div>
        <div className="col-md-4 col-12 text-md-end text-start mt-2 mt-md-0">
          <a
            href="http://localhost:5000/students-export/csv"
            className="btn btn-success d-flex align-items-center ms-md-auto"
            style={{
              fontWeight: 500,
              borderRadius: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: "8px 24px",
              fontSize: 16,
              gap: 8,
              whiteSpace: "nowrap",
              display: "inline-flex",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-download me-2"></i>
            Export CSV
          </a>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr key={s._id}>
                <td>{(page - 1) * limit + idx + 1}</td>
                <td>{s.name}</td>
                <td>{s.age}</td>
                <td>{s.email}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(s._id)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  {user?.role === "admin" && (
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDelete(s._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  // ...existing code...
}

export default StudentList;
