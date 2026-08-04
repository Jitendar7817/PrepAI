const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getFinalReport,
} = require("../controllers/finalReportController");

// ================================
// Final Placement Report
// ================================

router.get(
  "/:userId",
  protect,
  getFinalReport
);

module.exports = router;