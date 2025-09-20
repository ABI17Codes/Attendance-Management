import express from "express";
import "dotenv/config";
import DBConn from "./DBconn/db.js";
import router from "./router/router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createSuperAdmin } from "./middlewae/superAdmin.js";



const app = express();

app.use(cookieParser());
app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL (Vite default)
    credentials: true, // Allow cookies (JWT) to be sent
  })
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api",router)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  DBConn();
  createSuperAdmin();
  console.log("Server running on " + PORT);
});
