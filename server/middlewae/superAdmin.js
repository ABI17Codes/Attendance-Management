
import bcrypt from 'bcryptjs';
import Teacher from '../model/Teacher.js';

export const createSuperAdmin = async () => {
  const existingAdmin = await Teacher.findOne({ role: "admin" });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASS, 10);
    await Teacher.create({
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashed,
      role: "admin",
    });
    console.log("✅ Default admin created");
  }
};


