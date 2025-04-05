const User = require("../models/user.model");

// Get all employees (Only for managers)
const getAllEmployees = async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ error: "Forbidden: Only managers can view employees" });
    }

    const employees = await User.find({ role: "employee" }).select("-password");

    if (!employees || employees.length === 0) {
      return res.status(404).json({ error: "No employees found" });
    }

    res.status(200).json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific employee by ID (Only for managers)
const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ error: "Forbidden: Only managers can view employee details" });
    }

    const employee = await User.findOne({ _id: id, role: "employee" }).select("-password");

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({ employee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
};
