const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("./models/Student");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/studentdb");
const app = express();
app.use(express.json());
app.use(cors());

const { Parser } = require("json2csv");


// Middleware to protect routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Admin-only middleware
function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }
  next();
}

// Register route (allows admin registration)
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({
      username,
      password: hashedPassword,
      role: role || "user",
    });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
});
app.get("/students-export/csv", authMiddleware, async (req, res) => {
  const students = await Student.find();
  const fields = ["_id", "name", "age", "email"];
  const opts = { fields };
  try {
    const parser = new Parser(opts);
    const csv = parser.parse(students);
    res.header("Content-Type", "text/csv");
    res.attachment("students.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "Failed to export CSV" });
  }
});


// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    "your_jwt_secret",
    { expiresIn: "1h" }
  );
  res.json({ token });
});

// Get current user profile
app.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// Get students with pagination
app.get("/students", authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const students = await Student.find().skip(skip).limit(limit);
  const total = await Student.countDocuments();
  res.json({ students, total });
});

// Add student with validation
app.post("/students", authMiddleware, async (req, res) => {
  const { name, age, email } = req.body;
  if (!name || !email || !age) {
    return res.status(400).json({ error: "Name, age, and email are required" });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (age < 1 || age > 120) {
    return res.status(400).json({ error: "Age must be between 1 and 120" });
  }
  const student = new Student({ name, age, email });
  await student.save();
  res.json(student);
});

// Delete student (admin only)
app.delete("/students/:id", authMiddleware, adminOnly, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
});

// Edit student
app.put("/students/:id", authMiddleware, async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(student);
});

// Search students
app.get("/students/search", authMiddleware, async (req, res) => {
  const { q } = req.query;
  const students = await Student.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  });
  res.json(students);
});

// Export students to CSV
app.get("/students-export/csv", authMiddleware, async (req, res) => {
  const students = await Student.find();
  const fields = ["_id", "name", "age", "email"];
  const opts = { fields };
  try {
    const parser = new Parser(opts);
    const csv = parser.parse(students);
    res.header("Content-Type", "text/csv");
    res.attachment("students.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

// Change password
app.post("/change-password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch)
    return res.status(400).json({ error: "Old password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password changed successfully" });
});

app.get("/", (req, res) => {
  res.send("Student Management System API");
});
app.get("/users", authMiddleware, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});
app.put("/users/:id/promote", authMiddleware, adminOnly, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: "admin" },
    { new: true }
  ).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User promoted to admin", user });
});
app.delete("/users/:id", authMiddleware, adminOnly, async (req, res) => {
  if (req.user.userId === req.params.id) {
    return res.status(400).json({ error: "Admins cannot delete themselves." });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
