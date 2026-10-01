const Shop = require("../models/shop.model")
const DEMO_EMAIL = process.env.DEMO_EMAIL; // keep this in sync with the frontend value

const updateShopSettings = async (req, res) => {
  try {
    const shopId = req.shop._id;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.email.toLowerCase() === DEMO_EMAIL.toLowerCase()) {
      return res.status(403).json({ message: "Demo accounts cannot modify settings." });
    }

    // Only allow these specific fields to be updated here —
    // this blocks someone from sneaking in a password or status change
    // through this endpoint
    const allowedFields = [
      "shopName",
      "ownerName",
      "phoneNumber",
      "email",
      "address",
      "whatsappNumber",
      "currencySymbol",
      "receiptFooterMessage",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // If email is being changed, make sure it's not already taken by another shop
    if (updates.email) {
      const existingShop = await Shop.findOne({
        email: updates.email,
        _id: { $ne: shopId }, // exclude the current shop from this check
      });
      if (existingShop) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    const updatedShop = await Shop
      .findByIdAndUpdate(shopId, updates, {
        new: true, // return the updated document, not the old one
        runValidators: true, // re-run schema validation (e.g. phone number format)
      })
      .select("-password");



    res.status(200).json({ shop: updatedShop });
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings", error: error.message });
  }
};

module.exports = { updateShopSettings };