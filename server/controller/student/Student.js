import Student from "../../model/Student.js";
import bcrypt from "bcryptjs";

export const createStudent = async (req, res) => {
  try {
    const { name, rollnumber, email, password, standard } = req.body;

    // Basic validation
    if (!name || !rollnumber || !email || !password || !standard) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check for existing student with same roll number
    const existingStudent = await Student.findOne({ rollnumber });
    if (existingStudent) {
      return res.status(400).json({ msg: "Roll number already exists" });
    }

    // Optional: Hash password (if login is required later)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      name,
      rollnumber,
      email,
      password:hashedPassword,
      standard,
    });

    await student.save();

    res.status(201).json({ message: "Student created successfully", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get a single student
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ msg: "Student not found" });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollnumber, email, password, standard } = req.body;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ msg: "Student not found" });

    student.name = name || student.name;
    student.rollnumber = rollnumber || student.rollnumber;
    student.email = email || student.email;
    student.password = password || student.password;
    student.standard = standard || student.standard;

    await student.save();
    res.status(200).json({ message: "Student updated successfully", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) return res.status(404).json({ msg: "Student not found" });
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};