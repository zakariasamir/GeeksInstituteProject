// middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const user = jwt.verify(token, jwtSecret);
  if (!user) {
    return res.status(403).json({ message: "Unauthenticated" });
  }
  req.user = user;
  next();
};

module.exports = verifyToken;
