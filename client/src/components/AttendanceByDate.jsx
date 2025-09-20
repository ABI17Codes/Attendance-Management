import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const AttendanceByDate = () => {
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([]);

  const token = document.cookie.split("jwt=")[1];

  const fetchAttendance = async () => {
    try {
      const headers = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };

      const res = await axios.get(`${BASE_URL}/api/attendance?date=${date}`, headers);
      setRecords(res.data);
    //  console.log(res.data);
    } catch (err) {
      console.error("❌ Error fetching attendance:", err);
      alert("❌ Unauthorized or failed to fetch data.");
    }
  };


  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Attendance by Date</h2>

      <div className="mb-4">
        <input
          type="date"
          className="border p-2 rounded mr-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={fetchAttendance}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View
        </button>
      </div>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Roll No</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Standard</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r?._id}>
              <td className="p-2 border">{r.studentId?.name}</td>
              <td className="p-2 border">{r.studentId?.rollnumber}</td>
              <td className="p-2 border">{r.subject}</td>
              <td className="p-2 border">{r.studentId?.standard}</td>
              <td className="p-2 border">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceByDate;
