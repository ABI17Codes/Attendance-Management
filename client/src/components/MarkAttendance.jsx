import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const MarkAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [standard, setStandard] = useState("");

  const token = document.cookie.split("jwt=")[1]; // ✅ Extract token

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const headers = {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        };

        const res = await axios.get(`${BASE_URL}/api/students`, headers); // ✅ CORRECT endpoint
        setStudents(res.data);
      } catch (err) {
        console.error("❌ Error fetching students:", err);
      }
    };

    fetchStudents();
  }, [token]);

  // const handleCheckbox = (id, isPresent) => {
  //   setAttendance({ ...attendance, [id]: isPresent });
  // };

  const handleSubmit = async () => {
    try {
      const headers = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };

      const data = {
        date,
        subject,
        standard,
        students: Object.entries(attendance).map(([studentId, attendance]) => ({
          studentId,
          status: attendance,
        })),
      };
      console.log(data);

      await axios.post(`${BASE_URL}/api/attendance`, data, headers); // ✅ Add headers
      alert("✅ Attendance marked successfully!");
      setAttendance({});
      setSubject("");
      setStandard("");
      setDate("");
    } catch (err) {
      console.error(
        "❌ Error marking attendance:",
        err.response?.data || err.message
      );
      alert("❌ Error marking attendance.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Mark Attendance</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subject"
          className="border p-2 rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Class (Standard)"
          className="border p-2 rounded"
          value={standard}
          onChange={(e) => setStandard(e.target.value)}
          required
        />
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Roll No</th>
            <th className="p-2 border">Present</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.rollnumber}</td>
              <td className="p-2 border text-center">
                <select
                  className="border p-1 rounded"
                  value={attendance[s._id] || ""}
                  onChange={(e) =>
                    setAttendance({ ...attendance, [s._id]: e.target.value })
                  }
                >
                  <option value={""} disabled>
                    Select
                  </option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Attendance
      </button>
    </div>
  );
};

export default MarkAttendance;
