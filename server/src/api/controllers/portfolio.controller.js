const Portfolio = require("../models/portfolio.model"); // Assuming the portfolio model file is located here
const User = require("../models/user.model"); // To reference the employee in the schema

// Create Portfolio
const createPortfolio = async (req, res) => {
  const { name, position, bio, education, experience, projects, skills } =
    req.body;
  const picture = req.file ? req.file.path : null; // Get the file path if a picture is uploaded

  try {
    // Check if the user is a manager
    if (req.user.role !== "manager") {
      return res
        .status(403)
        .json({ error: "Forbidden: Only managers can create portfolios" });
    }

    // Check if all required fields are provided
    if (!name || !position || !bio) {
      return res.status(400).json({
        error: "Portfolio creation failed: Missing required information!",
      });
    }

    // Find the user (employee) by the provided employee ID in the request
    const user = await User.findById(req.body.employeeId); // Employee's ID is passed in the request body
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the new portfolio
    const newPortfolio = new Portfolio({
      employee: user._id,
      name,
      position,
      bio,
      picture,
      education,
      experience,
      projects,
      skills,
    });

    // Save the portfolio to the database
    const portfolio = await newPortfolio.save();

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      portfolio,
    });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    res.status(500).json({
      error: "Internal server error",
      message: `Error creating portfolio: ${error.message}`,
    });
  }
};

// Get Portfolio (by employee ID)
const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      employee: req.user.id,
    }).populate("employee", "username email");

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    res.status(200).json({ portfolio });
  } catch (error) {
    console.error("Error getting portfolio:", error);
    res.status(500).json({
      error: "Internal server error",
      message: `Error fetching portfolio: ${error.message}`,
    });
  }
};

// Get All Portfolios (for admins or superusers)
const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate(
      "employee",
      "username email"
    );

    if (!portfolios || portfolios.length === 0) {
      return res.status(404).json({ error: "No portfolios found" });
    }

    res.status(200).json({ portfolios });
  } catch (error) {
    console.error("Error fetching all portfolios:", error);
    res.status(500).json({
      error: "Internal server error",
      message: `Error fetching portfolios: ${error.message}`,
    });
  }
};

// Update Portfolio
const updatePortfolio = async (req, res) => {
  const { name, position, bio, education, experience, projects, skills } = req.body;
  const picture = req.file ? req.file.path : null;  // Get the file path if a picture is uploaded

  try {
    // Check if the user is a manager
    if (req.user.role !== "manager") {
      return res.status(403).json({ error: "Forbidden: Only managers can update portfolios" });
    }

    // Update the portfolio (only if the manager is updating a specific employee's portfolio)
    const portfolio = await Portfolio.findOneAndUpdate(
      { employee: req.body.employeeId },
      { name, position, bio, picture, education, experience, projects, skills },
      { new: true } // Return the updated portfolio
    );

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      portfolio,
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    res.status(500).json({
      error: "Internal server error",
      message: `Error updating portfolio: ${error.message}`,
    });
  }
};

// Delete Portfolio
const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      employee: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    res.status(200).json({
      success: true,
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    res.status(500).json({
      error: "Internal server error",
      message: `Error deleting portfolio: ${error.message}`,
    });
  }
};

module.exports = {
  createPortfolio,
  getPortfolioById,
  getAllPortfolios,
  updatePortfolio,
  deletePortfolio,
};
