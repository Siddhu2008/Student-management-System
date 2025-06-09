import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout, language, setLanguage, theme, toggleTheme }) {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: theme === "dark" ? "rgba(24,28,36,0.98)" : "#f8f9fa",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        borderBottom:
          theme === "dark" ? "1px solid #232a36" : "1px solid #e5e7eb",
        padding: "0.7rem 0",
      }}
    >
      <div className="container-fluid" style={{ maxWidth: 1200 }}>
        <span
          className="navbar-brand d-flex align-items-center"
          style={{
            color: theme === "dark" ? "#60a5fa" : "#2563eb",
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          <i
            className="bi bi-mortarboard-fill me-2"
            style={{ fontSize: 26 }}
          ></i>
          Student Management
        </span>
        <div className="d-flex align-items-center ms-auto gap-2">
          <Link
            to="/"
            className={`btn ${
              theme === "dark" ? "btn-outline-light" : "btn-outline-primary"
            } me-2 rounded-pill px-3`}
            style={{ border: "none", fontWeight: 500 }}
          >
            <i className="bi bi-people me-1"></i>Students
          </Link>
          <Link
            to="/add"
            className="btn btn-outline-success me-2 rounded-pill px-3"
            style={{ border: "none", fontWeight: 500 }}
          >
            <i className="bi bi-person-plus me-1"></i>Add Student
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/users"
              className="btn btn-outline-warning me-2 rounded-pill px-3"
              style={{ border: "none", fontWeight: 500 }}
            >
              <i className="bi bi-people-fill me-1"></i>Manage Users
            </Link>
          )}


          {/* Theme Toggle */}
          <button
            className={`btn btn-sm ${
              theme === "light" ? "btn-outline-dark" : "btn-outline-light"
            }`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{ minWidth: 110 }}
          >
            {theme === "light" ? (
              <>
                <i className="bi bi-moon-stars me-1"></i> Dark
              </>
            ) : (
              <>
                <i className="bi bi-brightness-high me-1"></i> Light
              </>
            )}
          </button>

          <button
            className="btn btn-outline-danger rounded-pill px-3 ms-2"
            style={{ border: "none", fontWeight: 500 }}
            onClick={onLogout}
          >
            <i className="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
