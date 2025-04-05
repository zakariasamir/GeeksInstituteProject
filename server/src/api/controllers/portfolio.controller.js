const Portfolio = require("../models/portfolio.model");
const User = require("../models/user.model");

// Create a new portfolio (Manager only)
const createPortfolio = async (req, res) => {
  try {
    const { education, experience, projects, skills, employeeId } = req.body;
    const picture = req.file?.path || null;

    // Check if portfolio already exists for the employee
    const existing = await Portfolio.findOne({ employee: employeeId });
    if (existing)
      return res
        .status(400)
        .json({ message: "Portfolio already exists for this employee." });

    const portfolio = new Portfolio({
      employee: employeeId,
      picture,
      education,
      experience,
      projects,
      skills,
    });

    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create portfolio", error: err.message });
  }
};

// Get a portfolio by ID
const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id).populate(
      "employee",
      "email role"
    );

    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    // Employees can only access their own
    if (
      req.user.role === "employee" &&
      portfolio.employee._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(portfolio);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get portfolio", error: err.message });
  }
};

// Get all portfolios (Manager only)
const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate(
      "employee",
      "email role"
    );
    res.status(200).json(portfolios);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch portfolios", error: err.message });
  }
};

// Update portfolio (Manager only)
const updatePortfolio = async (req, res) => {
  try {
    const { education, experience, projects, skills } = req.body;
    const picture = req.file?.path;

    const updateFields = {
      education,
      experience,
      projects,
      skills,
    };
    if (picture) updateFields.picture = picture;

    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    res.status(200).json(portfolio);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update portfolio", error: err.message });
  }
};

// Delete portfolio (Manager only)
const deletePortfolio = async (req, res) => {
  try {
    const deleted = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Portfolio not found" });

    res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete portfolio", error: err.message });
  }
};

module.exports = {
  createPortfolio,
  getPortfolioById,
  getAllPortfolios,
  updatePortfolio,
  deletePortfolio,
};
