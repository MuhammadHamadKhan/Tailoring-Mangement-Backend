const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    tailorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    measurements: [
      {
        label: String,
        value: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "ready", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true },
); // replaces manual createdAt/updatedAt, auto-updates on save

module.exports = mongoose.model("Order", orderSchema);
