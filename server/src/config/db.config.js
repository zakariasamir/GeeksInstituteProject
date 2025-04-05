const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.URL_MONGODB_SERVER_ATLAS + "/GeeksInstituteProject"
    );
    console.log("MongoDB connected to GeeksInstituteProject database");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit on failure
  }
};

module.exports = connectDB;
