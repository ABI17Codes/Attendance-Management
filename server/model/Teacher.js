import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    techid: { type: String, default: "1" },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "teacher",
      enum: ["teacher", "admin"],
    },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", TeacherSchema);
export default Teacher;
