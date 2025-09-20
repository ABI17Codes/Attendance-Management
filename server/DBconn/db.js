import mongoose from "mongoose";

const DBConn = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected Sucessfully....");
  } catch (err) {
    console.error("Error in DB connection", err);
    process.exit(1);
  }
};

export default DBConn;
