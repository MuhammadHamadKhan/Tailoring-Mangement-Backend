const express = require("express");
const router = express.Router();
const {
  createCustomer,
  createOrder,
  deleteCustomer,
  updateCustomer,
} = require("../controllers/customer.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {
  getAllCustomers,
  getOneCustomer,
} = require("../controllers/getCustomers.controller");
router.post("/add", authMiddleware, createCustomer);
router.patch("/update/:customerId", authMiddleware, updateCustomer);
router.get("/getOne/:customerId", authMiddleware, getOneCustomer);
router.get("/getAll", authMiddleware, getAllCustomers);
router.delete("/delete/:customerId", authMiddleware, deleteCustomer);
module.exports = router;
