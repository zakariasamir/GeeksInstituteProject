const express = require("express");
const router = express.Router();
const {
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getAllPortfolios,
  getPortfolioById,
  getPortfolioByEmployeeId,
} = require("../controllers/portfolio.controller");
const verifyToken = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const upload = require("../utils/upload");

// Manager routes
router.post(
  "/",
  verifyToken,
  allowRoles("manager"),
  upload.single("picture"),
  createPortfolio
);
router.put(
  "/:id",
  verifyToken,
  allowRoles("manager"),
  upload.single("picture"),
  updatePortfolio
);
router.delete("/:id", verifyToken, allowRoles("manager"), deletePortfolio);
router.get("/", verifyToken, allowRoles("manager"), getAllPortfolios);

// Manager & Employee
router.get("/:employeeId", verifyToken, getPortfolioByEmployeeId);
router.get("/:id", verifyToken, getPortfolioById);

module.exports = router;
