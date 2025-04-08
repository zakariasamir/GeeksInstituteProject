const Portfolio = require("../models/portfolio.model"); // Assuming the portfolio model file is located here
const User = require("../models/user.model"); // To reference the employee in the schema

// Create Portfolio
const createPortfolio = async (req, res) => {
  console.log("Creating portfolio with data:", req.body);
  console.log("File data:", req.file);
  const {
    employee,
    name,
    position,
    bio,
    education,
    experience,
    projects,
    skills,
  } = req.body;

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
    const user = await User.findById(req.body.employee); // Employee's ID is passed in the request body
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the new portfolio
    const portfolioData = {
      ...req.body,
      education: JSON.parse(education),
      experience: JSON.parse(experience),
      projects: JSON.parse(projects),
      skills: JSON.parse(skills),
      employee: employee,
    };

    if (req.file) {
      portfolioData.picture = req.file.path;
    }

    const portfolio = new Portfolio(portfolioData);

    // Save the portfolio to the database
    await portfolio.save();

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      portfolio,
    });
  } catch (error) {
    // console.error("Error creating portfolio:", error);
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
  try {
    // Check if the user is a manager
    if (req.user.role !== "manager") {
      return res
        .status(403)
        .json({ error: "Forbidden: Only managers can update portfolios" });
    }

    // Parse the JSON strings from the form data
    const updateData = {
      name: req.body.name,
      position: req.body.position,
      bio: req.body.bio,
      education: JSON.parse(req.body.education),
      experience: JSON.parse(req.body.experience),
      projects: JSON.parse(req.body.projects),
      skills: JSON.parse(req.body.skills),
      employee: req.body.employee,
    };

    // Add picture if a new one was uploaded
    if (req.file) {
      updateData.picture = req.file.path;
    }

    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
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
    const portfolioId = req.params.id;
    console.log("Deleting portfolio with ID:", portfolioId);
    const portfolio = await Portfolio.findByIdAndDelete(portfolioId);

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

const getPortfolioByEmployeeId = async (req, res) => {
  try {
    console.log("Fetching portfolio for employee ID:", req.params.employeeId);
    const portfolio = await Portfolio.findOne({
      employee: req.params.employeeId,
    }).populate("employee", "username email");

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    res.status(200).json({ portfolio });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: `Error fetching portfolio: ${error.message}`,
    });
  }
};

module.exports = {
  createPortfolio,
  getPortfolioById,
  getAllPortfolios,
  updatePortfolio,
  deletePortfolio,
  getPortfolioByEmployeeId,
};
