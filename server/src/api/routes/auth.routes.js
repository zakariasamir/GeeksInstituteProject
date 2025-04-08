const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  checkAuthStatus,
} = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/status", verifyToken, checkAuthStatus);

module.exports = router;
