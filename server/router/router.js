import express from "express";
import {
  teacherRegister,
  unifiedLogin,
} from "../controller/auth/techerAuth.js";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
} from "../controller/student/Student.js";
import { allowRoles, verifyToken } from "../middlewae/verifyToken.js";
import { createTeacher, getAllTeachers } from "../controller/teacherController.js";
import { getAttendanceByDate, getAttendanceByStudent, markAttendance } from "../controller/attendanceController.js";

const router = express.Router();

router.post("/auth/register", teacherRegister);
router.post("/auth/login", unifiedLogin);
router.post("/auth/logout", unifiedLogin);


// router for attendance
router.post("/students", verifyToken, allowRoles("admin", "teacher"), createStudent);
router.get("/students", verifyToken, allowRoles("admin", "teacher"), getAllStudents);
router.get("/students/:id", verifyToken, allowRoles("admin", "teacher"), getStudentById);
router.put("/students/:id", verifyToken, allowRoles("admin", "teacher"), updateStudent);
router.delete("/students/:id", verifyToken, allowRoles("admin", "teacher"), deleteStudent);

// 🧑‍🏫 Teacher routes
router.post("/teacher-create",verifyToken, allowRoles("admin"), createTeacher);
router.get("/teacher-all",verifyToken, allowRoles("admin"), getAllTeachers);

// 📅 Attendance routes
router.post("/attendance",verifyToken,allowRoles("admin", "teacher"), markAttendance);
router.get("/attendance",verifyToken, allowRoles("admin", "teacher"), getAttendanceByDate);

router.get("/attendance/student/:studentId",verifyToken, getAttendanceByStudent);

export default router;
