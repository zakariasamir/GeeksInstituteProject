const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const dotenv = require("dotenv");
dotenv.config();

const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "User creation failed: Missing required information!",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
      role: role || "employee",
    });

    const data = await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json([
        { error: "Internal server error" },
        { message: `Error creating User: ${error.message}` },
      ]);
  }
};

const login = async (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "Login failed: Missing required information!",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
      expiresIn: "1800s",
    });

    // Send token in httpOnly cookie and user info in response
    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", // Use secure in production
        // sameSite: "strict",
        maxAge: 1800000, // 30 minutes in milliseconds
      })
      .json({
        message: "Login Successful",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    return res
      .status(500)
      .json([
        { error: "Internal server error" },
        { message: `Error logging in User: ${error.message}` },
      ]);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
  } catch (error) {
    return res
      .status(500)
      .json([
        { error: "Internal server error" },
        { message: `Error logging out User: ${error.message}` },
      ]);
  }
};

const checkAuthStatus = async (req, res) => {
  try {
    // Get user from database using the ID from verified token
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ error: "Not authenticated" });
  }
};

module.exports = {
  register,
  login,
  logout,
  checkAuthStatus,
};
