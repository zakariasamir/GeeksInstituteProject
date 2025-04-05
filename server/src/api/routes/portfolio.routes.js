const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');
const upload = require('../utils/upload');

// Manager routes
router.post('/', verifyToken, allowRoles('manager'), upload.single('picture'), portfolioController.createPortfolio);
router.put('/:id', verifyToken, allowRoles('manager'), upload.single('picture'), portfolioController.updatePortfolio);
router.delete('/:id', verifyToken, allowRoles('manager'), portfolioController.deletePortfolio);
router.get('/', verifyToken, allowRoles('manager'), portfolioController.getAllPortfolios);

// Manager & Employee
router.get('/:id', verifyToken, portfolioController.getPortfolioById);

module.exports = router;
