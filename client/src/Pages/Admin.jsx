import { useEffect, useState } from "react";
import axios from "axios";
import MarkAttendance from "../components/MarkAttendance";
import StudentAttendance from "../components/StudentAttendance";
import AttendanceByDate from "../components/AttendanceByDate";
import Logout from "../components/Logout ";

const BASE_URL = "http://localhost:3000";

const Admin = () => {
  const [selected, setSelected] = useState("addTeacher");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [studentForm, setStudentForm] = useState({
    name: "",
    rollnumber: "",
    email: "",
    password: "",
    standard: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = document.cookie.split("jwt=")[1];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
      const [tRes, sRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/teacher-all`, headers),
        axios.get(`${BASE_URL}/api/students`, headers),
      ]);

      // Filter out superadmin
      const filteredTeachers = Array.isArray(tRes.data)
        ? tRes.data.filter((t) => t.role !== "admin")
        : [];

      setTeachers(filteredTeachers);
      setStudents(Array.isArray(sRes.data) ? sRes.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
      await axios.post(`${BASE_URL}/api/teacher-create`, teacherForm, headers);
      fetchData();
      setTeacherForm({ name: "", email: "", password: "" });
    } catch {
      alert("Failed to add teacher.");
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
      await axios.post(`${BASE_URL}/api/students`, studentForm, headers);
      fetchData();
      setStudentForm({
        name: "",
        rollnumber: "",
        email: "",
        password: "",
        standard: "",
      });
    } catch {
      alert("Failed to add student.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-white w-64 p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-blue-600">Admin Panel</h2>
        <nav className="space-y-3">
          <button
            onClick={() => setSelected("addTeacher")}
            className={`w-full text-left px-4 py-2 rounded ${
              selected === "addTeacher"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            ➕ Add Teacher
          </button>
          <button
            onClick={() => setSelected("addStudent")}
            className={`w-full text-left px-4 py-2 rounded ${
              selected === "addStudent"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            ➕ Add Student
          </button>
          {/* <button
            onClick={() => setSelected("StudentAttendance")}
            className={`w-full text-left px-4 py-2 rounded ${
              selected === "StudentAttendance"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            StudentAttendance
          </button> */}
          <button
            onClick={() => setSelected("AttendanceByDate")}
            className={`w-full text-left px-4 py-2 rounded ${
              selected === "AttendanceByDate"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            AttendanceByDate
          </button>
          <button
            onClick={() => setSelected("MarkAttendance")}
            className={`w-full text-left px-4 py-2 rounded ${
              selected === "MarkAttendance"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            MarkAttendance
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">🛠️ Admin Dashboard</h1>
              <Logout />
        {error && <p className="text-red-600">{error}</p>}
        {loading && <p className="text-gray-600">Loading...</p>}

        {selected === "addTeacher" && (
          <div className="space-y-6">
            {/* Add Teacher */}
            <div className="bg-white p-4 rounded shadow max-w-xl">
              <h2 className="text-xl font-semibold mb-4">➕ Add Teacher</h2>
              <form onSubmit={handleAddTeacher} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border px-3 py-2 rounded"
                  value={teacherForm.name}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border px-3 py-2 rounded"
                  value={teacherForm.email}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, email: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border px-3 py-2 rounded"
                  value={teacherForm.password}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, password: e.target.value })
                  }
                  required
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Add Teacher
                </button>
              </form>
            </div>

            {/* Teachers List */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">👨‍🏫 Teachers List</h2>
              {teachers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100 text-left">
                      <tr>
                        <th className="px-4 py-2 border-b">Name</th>
                        <th className="px-4 py-2 border-b">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((t) => (
                        <tr key={t._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b">{t.name}</td>
                          <td className="px-4 py-2 border-b">{t.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">No teachers found.</p>
              )}
            </div>
          </div>
        )}

        {selected === "addStudent" && (
          <div className="space-y-6">
            {/* Add Student */}
            <div className="bg-white p-4 rounded shadow max-w-xl">
              <h2 className="text-xl font-semibold mb-4">➕ Add Student</h2>
              <form onSubmit={handleAddStudent} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border px-3 py-2 rounded"
                  value={studentForm.name}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Roll Number"
                  className="w-full border px-3 py-2 rounded"
                  value={studentForm.rollnumber}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      rollnumber: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border px-3 py-2 rounded"
                  value={studentForm.email}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, email: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border px-3 py-2 rounded"
                  value={studentForm.password}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, password: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Standard"
                  className="w-full border px-3 py-2 rounded"
                  value={studentForm.standard}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, standard: e.target.value })
                  }
                  required
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Add Student
                </button>
              </form>
            </div>

            {/* Students List */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">🎓 Students List</h2>
              {students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100 text-left">
                      <tr>
                        <th className="px-4 py-2 border-b">Name</th>
                        <th className="px-4 py-2 border-b">Roll Number</th>
                        <th className="px-4 py-2 border-b">Email</th>
                        <th className="px-4 py-2 border-b">Standard</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b">{s.name}</td>
                          <td className="px-4 py-2 border-b">{s.rollnumber}</td>
                          <td className="px-4 py-2 border-b">{s.email}</td>
                          <td className="px-4 py-2 border-b">{s.standard}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">No students found.</p>
              )}
            </div>
          </div>
        )}
        {selected === "StudentAttendance" && (
          <div>
            <>
              <StudentAttendance />
            </>
            :( <p className="text-gray-600">No students found.</p>)
          </div>
        )}

        {selected === "AttendanceByDate" && (
          <div>
              <AttendanceByDate />
          </div>
        )}
        {selected === "MarkAttendance" && (
          <div>
            <>
              <MarkAttendance />
            </>
            :( <p className="text-gray-600">No students found.</p>)
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
