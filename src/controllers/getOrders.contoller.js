const Order = require("../models/order.model");
const Customer = require("../models/customer.model");

const getAllOrders = async (req, res) => {
  try {
    const tailorId = req.shop._id;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const { search, status } = req.query;

    const query = { tailorId };

    // Filter by status
    if (status && ["pending", "ready", "delivered"].includes(status)) {
      query.status = status;
    }

    // Search customer by name or phone number
    if (search) {
      const customers = await Customer.find({
        tailorId,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phoneNumber: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      query.customerId = {
        $in: customers.map((customer) => customer._id),
      };
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .populate("customerId", "name phoneNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Order.countDocuments(query),
    ]);

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getOneCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer Id is required",
      });
    }

    const customer = await Customer.findOne({
      _id: customerId,
      tailorId: req.shop._id,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer Not Found",
      });
    }

    const orders = await Order.find({
      tailorId: req.shop._id,
      customerId,
    })
      .populate("customerId", "name phoneNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        message: "OrderId is Required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      tailorId: req.shop._id,
    }).populate("customerId", "name phoneNumber measurements");

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found",
      });
    }

    return res.status(200).json({
      message: "Order Fetched Successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred while fetching order",
      error: error.message,
    });
  }
};
module.exports = { getAllOrders, getOneCustomerOrders, getSingleOrder };
