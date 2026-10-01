const Shop = require("../models/shop.model");
const Customer = require("../models/customer.model");
const createCustomer = async (req, res) => {
  const { name, phoneNumber, measurements } = req.body;
  if (!name || !phoneNumber || !measurements) {
    return res.status(400).json({ messaage: "All fields are required" });
  }

  try {
    //If Same phoneNumber and Name exist
    const existingCustomer = await Customer.findOne({
      tailorId: req.shop._id,
      phoneNumber,
      name: { $regex: `^${name}$`, $options: "i" }, // case-insensitive exact match
    });

    if (existingCustomer) {
      return res.status(409).json({ message: "customer Already Exist" });
    }
    const newCustomer = new Customer({
      tailorId: req.shop._id,
      ...req.body,
    });
    await newCustomer.save();
    return res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred while creating customer",
      error: error.message,
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (customer.tailorId.toString() !== req.shop._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this customer" });
    }

    await Customer.findByIdAndDelete(customerId);

    return res.status(200).json({
      message: "Customer deleted successfully",
      customerId: customer._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { name, phoneNumber, measurements } = req.body;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        message: "Customer Not Found",
      });
    }
    if (customer.tailorId.toString() !== req.shop._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not Authorized to Update this Customer" });
    }

    if (name !== undefined) customer.name = name;
    if (phoneNumber !== undefined) customer.phoneNumber = phoneNumber;
    if (measurements !== undefined) customer.measurements = measurements;
    await customer.save();
    return res.status(200).json({
      message: "Customer Updated Successfully",
      customer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
module.exports = { createCustomer, deleteCustomer, updateCustomer };
