const Customer = require("../models/customer.model");
const Order = require("../models/order.model");
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ tailorId: req.shop._id });

    return res.status(200).json({
      message: "Fetched customers successfully",
      customers,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const getOneCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res.status(400).json({ message: "CustomerId is Required" });
    }
    const customer = await Customer.findById(customerId);
    return res
      .status(200)
      .json({ messsage: "Customer Fetched Successfully", customer });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllCustomers, getOneCustomer };
