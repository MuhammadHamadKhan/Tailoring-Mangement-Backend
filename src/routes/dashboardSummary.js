const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getDashboardSummary } = require("../controllers/summary.controller");

router.get("/summary", authMiddleware, getDashboardSummary);
module.exports = router;
