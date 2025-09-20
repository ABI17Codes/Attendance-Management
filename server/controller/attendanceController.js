import Attendance from "../model/Attendance.js";

export const markAttendance = async (req, res) => {
  try {
    const { date, subject, students, standard } = req.body;
    const teacherId = req.user?.id; // Make sure req.user is populated correctly by verifyToken middleware

    // Validate request
    if (
      !date ||
      !subject ||
      !Array.isArray(students) ||
      students.length === 0
    ) {
      return res.status(400).json({
        error: "'date', 'subject', and 'students' array are required",
      });
    }

    // Prepare attendance entries
    const attendanceRecords = students.map((student) => ({
      date,
      subject,
      standard,
      studentId: student.studentId,
      status: student.status,
      teacherId: teacherId,
    }));

    const result = await Attendance.insertMany(attendanceRecords);
    res.status(201).json({ message: "Attendance marked", data: result });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/attendance?date=YYYY-MM-DD
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const records = await Attendance.find({ date: new Date(date) })
      .populate("studentId", "name rollnumber standard")
      .populate("teacherId", "name");

    // const start = new Date(date);
    // const end = new Date(date);
    // end.setDate(end.getDate() + 1);

    // const records = await Attendance.find({
    //   date: {
    //     $gte: start,
    //     $lt: end,
    //   },
    // });

    res.status(200).json(records);
    // console.log(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controller/attendanceController.js
export const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log(studentId);

    const records = await Attendance.find({ studentId })
      .populate("teacherId", "name")
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (err) {
    console.error("❌ Error fetching attendance for student:", err);
    res.status(500).json({ error: "Server error" });
  }
};
