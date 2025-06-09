import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList({ token, user }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setMessage("Failed to fetch users");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchUsers();
    // eslint-disable-next-line
  }, []);

  const promoteUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/users/${id}/promote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("User promoted to admin!");
      fetchUsers();
    } catch (err) {
      setMessage("Failed to promote user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("User deleted!");
      fetchUsers();
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  if (user?.role !== "admin") {
    return <div className="alert alert-danger m-4">Admins only</div>;
  }

  return (
    <div
      className="card shadow p-4 mt-4"
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      <h4 className="mb-3">All Users</h4>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u._id}>
                <td>{idx + 1}</td>
                <td>{u.username}</td>
                <td>
                  {u.role}
                  {u.role === "admin" && (
                    <span className="badge bg-warning text-dark ms-2">
                      Admin
                    </span>
                  )}
                </td>
                <td>
                  {u.role !== "admin" && (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => promoteUser(u._id)}
                    >
                      Promote to Admin
                    </button>
                  )}
                  {u._id !== user.userId && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
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
}

export default UserList;
