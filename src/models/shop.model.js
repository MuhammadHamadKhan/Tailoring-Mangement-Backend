const mongoose = require("mongoose");
const validator = require("validator");
const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^03\d{9}$/, "Enter a valid Pakistani phone number"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    // --- new settings fields ---
    whatsappNumber: {
      type: String,
      default: "",
    },
    currencySymbol: {
      type: String,
      default: "Rs.",
    },
    receiptFooterMessage: {
      type: String,
      default: "Thank you for trusting us with your stitching.",
    },
  },
  { timestamps: true },
);

const shopModel = mongoose.model("Shop", shopSchema);

module.exports = shopModel;
