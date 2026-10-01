const Shop = require("../models/shop.model");
const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const shop = await Shop.findById(decoded.shopId).select("-password");
    if (!shop) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    if (shop.status === "pending") {
      return res.status(401).json({ message: "Wait for admin approval" });
    }
    req.shop = shop;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized access", error: error.message });
  }
};
module.exports = authMiddleware;
