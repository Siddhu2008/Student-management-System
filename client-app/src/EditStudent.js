import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditStudent({ token, fetchStudents }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({ name: "", age: "", email: "" });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudent(res.data));
  }, [id, token]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:5000/students/${id}`,
      student,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchStudents();
    navigate("/");
  };

  return (
    <div className="card shadow p-4" style={{ maxWidth: 500, margin: "40px auto" }}>
      <h4 className="mb-3">Edit Student</h4>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="name"
          value={student.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          className="form-control mb-2"
          name="age"
          value={student.age}
          onChange={handleChange}
          placeholder="Age"
          type="number"
          required
        />
        <input
          className="form-control mb-2"
          name="email"
          value={student.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
        />
        <button className="btn btn-success" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}

export default EditStudent;