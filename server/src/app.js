const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.config");
const authRoutes = require("./api/routes/auth.routes");
const portfolioRouter = require("./api/routes/portfolio.routes");
const employeeRoutes = require("./api/routes/employee.routes");
const cookieParser = require("cookie-parser");
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  alloowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

async function main() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors(corsOptions));
  dotenv.config();
  connectDB();
  app.use("/api/auth", authRoutes);
  app.use("/api/portfolio", portfolioRouter);
  app.use("/api/employees", employeeRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

try {
  main();
} catch (error) {
  console.log(error);
}
