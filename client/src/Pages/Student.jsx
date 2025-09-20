import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Logout from "../components/Logout ";

const BASE_URL = "http://localhost:3000";

const Student = () => {
  const { studentId } = useParams();
  console.log("👀 studentId:", studentId);

  const [attendance, setAttendance] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const headers = {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        };

        // ✅ Get attendance
        const res = await axios.get(
          `${BASE_URL}/api/attendance/student/${studentId}`,
          headers
        );
        setAttendance(res.data);

        const studentRes = await axios.get(
          `${BASE_URL}/api/students/${studentId}`,
          headers
        );
        console.log(studentRes.data);
        setStudentName(studentRes.data.name);
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to load attendance.");
      }
    };

    if (studentId) fetchAttendance();
  }, [studentId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">📋 My Attendance</h2>
      <p className="text-gray-600 mb-4">
        👤 Student Name:{" "}
        <span className="font-semibold">{studentName || "Student"}</span>
      </p>

      {error && <p className="text-red-500">{error}</p>}
      <Logout />

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Marked By</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record._id}>
              <td className="p-2 border">
                {new Date(record.date).toLocaleDateString()}
              </td>
              <td className="p-2 border">{record.subject || "-"}</td>
              <td className="p-2 border">
                {record.status === "present" ? (
                  <span className="text-green-600 font-semibold">Present</span>
                ) : (
                  <span className="text-red-600 font-semibold">Absent</span>
                )}
              </td>
              <td className="p-2 border">{record.teacherId?.name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Student;
