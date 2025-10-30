const Order = require("../models/Order");
const User = require("../models/User");

const getAnalyticsSummary = async (req, res) => {
  try {
    const totalClients = await User.countDocuments({});

    const result = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$grandTotal" } } },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;

    const totalOrders = await Order.countDocuments();

    res.json({
      totalClients,
      totalRevenue,
      totalOrders,
    });
  } catch (err) {
    console.error("getAnalyticsSummary error:", err);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
};

module.exports = { getAnalyticsSummary };
