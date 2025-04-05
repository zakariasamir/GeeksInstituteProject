const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db.config");
const authRoutes = require("./api/routes/auth.routes");
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

async function main() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  dotenv.config();
  connectDB();
  app.use("/auth", authRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

try {
  main();
} catch (error) {
  console.log(error);
}
