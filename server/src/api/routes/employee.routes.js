const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
} = require("../controllers/employee.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getAllEmployees);
router.get("/:id", verifyToken, getEmployeeById);

module.exports = router;
