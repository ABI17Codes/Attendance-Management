// import jwt from "jsonwebtoken";
// import Teacher from "../model/Teacher.js";

// export const verifyToken = async (req, res, next) => {
//   let token = req.cookies.jwt;

//   // If no cookie token, check Authorization header
//   if (!token && req.headers.authorization?.startsWith("Bearer ")) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) return res.status(401).json({ msg: "Unauthorized: No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.secret_key);
//     const user = await Teacher.findById(decoded.id).select("-password");
//     if (!user) {
//       return res.status(401).json({ msg: "Invalid token user" });
//     }

//     req.user = decoded;
//     next();
//     console.log("✅ Token verified");
//   } catch (err) {
//     res.status(401).json({ msg: "Invalid or expired token" });
//   }
// };



export const allowRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user; // assume req.user is set after token verify
    if (!roles.includes(user.role)) {
      return res.status(403).json({  msg: `Access denied: ${user.role} only` });
    }
    next();
    console.log("verified role", user.role);
  };
};

import jwt from "jsonwebtoken";
import Teacher from "../model/Teacher.js";
import Student from "../model/Student.js";

export const verifyToken = async (req, res, next) => {
  let token = req.cookies.jwt;

  // Fallback to Authorization header
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ msg: "Unauthorized: No token" });

  try {
    const decoded = jwt.verify(token, process.env.secret_key);

    // Try to find user in Teacher collection first
    let user = await Teacher.findById(decoded.id).select("-password");
    if (!user) {
      // If not found in Teacher, try Student
      user = await Student.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(401).json({ msg: "Invalid token user" });
    }

    req.user = { ...decoded, role: user.role || "student" };
    next();
    console.log("✅ Verified token for:", req.user.role);
  } catch (err) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};
