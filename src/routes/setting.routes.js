const express = require("express");
const { updateShopSettings } = require("../controllers/shopSettings.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


router.put("/settings", authMiddleware, updateShopSettings);

module.exports = router;