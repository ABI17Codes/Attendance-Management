import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollnumber: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    standard: { type: String, required: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);
export default Student;
