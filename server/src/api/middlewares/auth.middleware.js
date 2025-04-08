// middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!req.cookies) {
    console.log("No cookies object in request");
    return res.status(401).json({
      success: false,
      message: "Access denied. No cookies available.",
    });
  }
  const token = req.cookies.token;

  // Debug log - remove in production
  console.log("Checking authentication...");
  console.log("Token present:", !!token);

  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Check token expiration
    if (decoded.exp * 1000 < Date.now()) {
      console.log("Token expired");
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    // Add user info to request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    console.log("Authentication successful for user:", decoded.id);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to authenticate token",
    });
  }
};

module.exports = verifyToken;
