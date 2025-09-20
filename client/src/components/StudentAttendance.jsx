import { useEffect, useState } from "react";
import axios from "axios";


const BASE_URL = "http://localhost:3000";

const StudentAttendance = () => {
  const [studentId, setStudentId] = useState("");
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await axios.get(BASE_URL+"/api/students");
      setStudents(res.data);
    };
    fetchStudents();
  }, []);

  const fetchHistory = async () => {
    const res = await axios.get(`${BASE_URL}/api/attendance/student/${studentId}`);
    setRecords(res.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Student Attendance History</h2>
      <div className="flex gap-2 mb-4">
        <select
          className="border p-2"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.rollnumber})
            </option>
          ))}
        </select>
        <button onClick={fetchHistory} className="bg-blue-600 text-white px-4 py-2 rounded">
          View
        </button>
      </div>

      {records.length > 0 && (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{r.date.slice(0, 10)}</td>
                <td className="p-2 border">{r.present ? "✅ Present" : "❌ Absent"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentAttendance;
