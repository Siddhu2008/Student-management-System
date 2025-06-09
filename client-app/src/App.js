import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import StudentList from "./StudentList";
import AddStudent from "./AddStudent";
import Login from "./Login";
import EditStudent from "./EditStudent";
import Profile from "./Profile";
import Navbar from "./Navbar";
import AdminAuth from "./AdminAuth";
import UserList from "./UserList";
import RequireAdmin from "./RequireAdmin";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Language and theme state
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  // Fetch students list
  const fetchStudents = async () => {
    try {
      let url = `http://localhost:5000/students?page=${page}&limit=${limit}`;
      if (search) url = `http://localhost:5000/students/search?q=${search}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (search) {
        setStudents(res.data);
        setTotal(res.data.length);
      } else {
        setStudents(res.data.students);
        setTotal(res.data.total);
      }
    } catch {
      setStudents([]);
      setTotal(0);
    }
  };

  // Refetch students when token, page, or search changes
  useEffect(() => {
    if (token) fetchStudents();
    // eslint-disable-next-line
  }, [token, page, search]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Render logic
  if (!token) {
    return <Login setToken={setToken} setUser={setUser} />;
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div
      className={
        theme === "dark"
          ? "bg-dark text-light min-vh-100"
          : "bg-light text-dark min-vh-100"
      }
      style={{ minHeight: "100vh" }}
    >
      {/* Navbar now contains language and theme controls */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className="container py-3">
        <Routes>
          <Route
            path="/"
            element={
              <StudentList
                students={students}
                user={user}
                page={page}
                limit={limit}
                search={search}
                setSearch={setSearch}
                setPage={setPage}
                total={total}
                token={token}
                fetchStudents={fetchStudents}
                language={language}
              />
            }
          />
          <Route
            path="/add"
            element={
              <AddStudent
                token={token}
                fetchStudents={fetchStudents}
                language={language}
              />
            }
          />
          <Route
            path="/profile"
            element={<Profile token={token} user={user} language={language} />}
          />
          <Route
            path="/admin-auth"
            element={
              <AdminAuth
                setToken={setToken}
                setUser={setUser}
                language={language}
              />
            }
          />
          <Route
            path="/edit/:id"
            element={
              <EditStudent
                token={token}
                fetchStudents={fetchStudents}
                language={language}
              />
            }
          />
          <Route
            path="/users"
            element={
              <RequireAdmin user={user}>
                <UserList token={token} user={user} language={language} />
              </RequireAdmin>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {/* Pagination controls only on StudentList page */}
        {location.pathname === "/" && !search && (
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${page === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export default App;
