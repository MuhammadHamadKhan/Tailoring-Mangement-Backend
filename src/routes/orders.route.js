const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getAllOrders,
  getOneCustomerOrders,
  getSingleOrder,
} = require("../controllers/getOrders.contoller");

const {
  createOrder,
  deleteOrder,
  updateOrderStatus,
} = require("../controllers/order.controller");

// Create order
router.post("/create", authMiddleware, createOrder);

// Get all orders
// Supports: ?page=1&limit=10&search=ali&status=pending
router.get("/getAll", authMiddleware, getAllOrders);

// Get all orders of one customer
router.get("/customer/:customerId", authMiddleware, getOneCustomerOrders);

// Get one order
router.get("/getOne/:orderId", authMiddleware, getSingleOrder);

// Update order status
router.patch("/update/:orderId", authMiddleware, updateOrderStatus);

// Delete order
router.delete("/delete/:orderId", authMiddleware, deleteOrder);

module.exports = router;
