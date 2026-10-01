const Order = require("../models/order.model");
const Customer = require("../models/customer.model");

const getDashboardSummary = async (req, res) => {
  try {
    const tailorId = req.shop._id;

    const [
      totalOrders,
      totalCustomers,
      pendingOrders,
      readyOrders,
      deliveredOrders,
    ] = await Promise.all([
      Order.countDocuments({ tailorId }),
      Customer.countDocuments({ tailorId }),
      Order.countDocuments({ tailorId, status: "pending" }),
      Order.countDocuments({ tailorId, status: "ready" }),
      Order.countDocuments({ tailorId, status: "delivered" }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalCustomers,
        pendingOrders,
        readyOrders,
        deliveredOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
    });
  }
};

module.exports = { getDashboardSummary };
