import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Teacher from "./Pages/Teacher";
import Student from "./Pages/Student";
import Admin from "./Pages/Admin";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/student/:studentId" element={<Student />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
};

export default App;
