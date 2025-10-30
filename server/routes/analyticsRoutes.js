const express = require("express");
const { getAnalyticsSummary } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/analytics/summary", getAnalyticsSummary);

module.exports = router;
