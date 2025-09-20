import Teacher from "../../model/Teacher.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../../model/Student.js";

export const teacherRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isEmail = await Teacher.findOne({ email });
    if (isEmail) return res.status(400).json({ msg: "Email already in use" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const NewTeacher = new Teacher({ name, email, password: hashPassword });
    await NewTeacher.save();

    res.status(201).json({ message: "Teacher created successfully" });
  } catch (err) {
    console.error("Error in teacherRegister:", err);
    res.status(500).json({ err: "Internal server error" });
  }
};

export const unifiedLogin = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ msg: "Identifier and password required" });
  }

  try {
    let user,
      role = "";

    // Check if it's an email (for teacher) or rollnumber (for student)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    if (isEmail) {
      // Teacher login
      user = await Teacher.findOne({ email: identifier });
      // console.log(user);
      // console.log(user.techid);
      // console.log(process.env.TECH_ID);
      if (user.role === "admin") {
        role = "admin";
      } else {
        role =
          user.techid === process.env.TECH_ID
            ? "teacher"
            : "Role Id is Not Matching";
      }
    } else {
      // Student login
      user = await Student.findOne({ rollnumber: identifier });
      role = "student";
    }

    if (!user) {
      return res
        .status(400)
        .json({ msg: `${isEmail ? "Email" : "Roll number"} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    // const roleCheck = user.
    const token = jwt.sign({ id: user._id, role }, process.env.secret_key, {
      expiresIn: "30d",
    });

    res.cookie("jwt", token, {
      // maxAge: 30 * 24 * 60 * 60 * 1000,
      // httpOnly: true,
      // sameSite: "strict",
      // secure: process.env.NODE_ENV !== "development",

      httpOnly: true,
      secure: false, // Must be false for local dev
      sameSite: "lax", // Or "none" if needed for full cross-origin
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: `${
        role.charAt(0).toUpperCase() + role.slice(1)
      } login successful`,
      role,
      _id: user._id,
    });
  } catch (err) {
    console.error("Error in unifiedLogin:", err);
    res.status(500).json({ err: "Internal server error" });
  }
};

// export const teacherLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const teacher = await Teacher.findOne({ email });
//     if (!teacher) return res.status(400).json({ msg: "Email not found" });

//     const isPass = await bcrypt.compare(password, teacher.password);
//     if (!isPass) return res.status(400).json({ msg: "Incorrect password" });

//     const token = jwt.sign({ id: teacher._id }, process.env.secret_key, {
//       expiresIn: "30d",
//     });

//     res.cookie("jwt", token, {
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//       httpOnly: true,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV !== "development",
//     });

//     res.status(200).json({ message: "Teacher login successfully" });
//   } catch (err) {
//     console.error("Error in teacherLogin:", err);
//     res.status(500).json({ err: "Internal server error" });
//   }
// };
