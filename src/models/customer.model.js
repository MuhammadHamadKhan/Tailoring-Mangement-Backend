const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    tailorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true, // every query will filter by tailor, so index this
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^03\d{9}$/, "Enter a valid Pakistani phone number"],
    },
    name: {
      type: String,
    },
    measurements: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

const customerModel = mongoose.model("Customer", customerSchema);

module.exports = customerModel;
