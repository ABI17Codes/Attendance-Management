import Teacher from "../model/Teacher.js";
import bcrypt from 'bcryptjs';


// POST /api/teachers

export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, subjects = [] } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, Email, and Password are required" });
    }

    // Optional: check if email already exists
    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      subjects,
    });

    await teacher.save();
    res.status(201).json({ msg: "Teacher created successfully", teacher });
  } catch (err) {
    console.error("Error in createTeacher:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
