const express = require("express");
const router = express.Router();

const {
  RegisterShop,
  LoginShop,
  LogoutShop,
  DemoLogin,
  authMe,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
router.post("/register", RegisterShop);
router.post("/login", LoginShop);
router.post("/logout", authMiddleware, LogoutShop);
router.post("/demo/login", DemoLogin);
router.get("/me", authMiddleware, authMe);
module.exports = router;
