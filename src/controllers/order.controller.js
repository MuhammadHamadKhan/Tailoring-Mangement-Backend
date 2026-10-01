const Order = require("../models/order.model");
const Customer = require("../models/customer.model");
const createOrder = async (req, res) => {
  const { customerId, price, measurements } = req.body;
  if (!price || !measurements || !customerId) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: "Customer not exist" });
    }
    const order = new Order({
      tailorId: req.shop._id,
      customerId,
      price,
      measurements,
    });
    await order.save();
    return res
      .status(201)
      .json({ message: "Order created successfully", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ message: "OrderId is Required" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }
    if (order.tailorId.toString() !== req.shop._id.toString()) {
      return res
        .status(403)
        .json({ messsage: "Not Authorized To Delete This Order" });
    }
    await Order.findOneAndDelete(orderId);
    return res
      .status(200)
      .json({ message: "Order Deleted Successfully", orderId: order._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.messaage });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: "OrderId is required" });
    }
    const validStatuses = ["pending", "ready", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Make sure this order belongs to the logged-in tailor
    if (order.tailorId.toString() !== req.shop._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};
module.exports = { createOrder, deleteOrder, updateOrderStatus };
