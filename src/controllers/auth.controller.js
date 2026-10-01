const Shop = require("../models/shop.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RegisterShop = async (req, res) => {
  try {
    const { shopName, ownerName, phoneNumber, email, password, address } =
      req.body;
    const fields = {
      shopName,
      ownerName,
      phoneNumber,
      email,
      password,
      address,
    };

    const trimmed = {};
    for (const key in fields) {
      // trim everything for storage EXCEPT password
      trimmed[key] = key === "password" ? fields[key] : fields[key]?.trim();
    }

    // separately, just for the emptiness check — trim password only to test, don't store it
    const missingField = Object.entries(trimmed).find(([key, value]) => {
      if (key === "password") {
        return !value?.trim(); // check trimmed length without altering the real value
      }
      return !value;
    });

    if (missingField) {
      return res
        .status(400)
        .json({ message: `${missingField[0]} is required` });
    }

    const isShopExist = await Shop.findOne({ email });

    if (isShopExist) {
      return res
        .status(400)
        .json({ message: "Shop already exists with this email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const shop = new Shop({
      shopName,
      ownerName,
      phoneNumber,
      email,
      password: hashedPassword,
      address,
      // status defaults to "pending" from the schema
    });

    await shop.save();

    return res.status(201).json({
      message: "Shop registered successfully, wait for admin approval",
    });
  } catch (error) {
    console.error("Register shop error:", error);
    return res.status(500).json({
      message: "Error occurred while creating shop",
      error: error.message,
    });
  }
};

const LoginShop = async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email?.trim();

    if (!trimmedEmail || !password?.trim()) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    const shop = await Shop.findOne({ email: trimmedEmail });
    if (!shop) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, shop.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (shop.status !== "paid") {
      return res.status(403).json({
        message:
          "Your account is not approved yet. Please wait for admin approval or if you have not paid the subscription fee, please pay the subscription fee to get access to your account.",
      });
    }

    const token = jwt.sign({ shopId: shop._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successfully",
        shopId: shop._id,
        shopName: shop.shopName,
        ownerName: shop.ownerName,
        phoneNumber: shop.phoneNumber,
        email: shop.email, // ✅ fixed
        address: shop.address,
        status: shop.status,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error occurred while logging in" });
  }
};

const LogoutShop = async (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    })
    .status(200)
    .json({ message: "Logout successfully" });
};
// controllers/shop.controller.js
const DemoLogin = async (req, res) => {
  try {
    const demoShop = await Shop.findOne({ email: "demo@socialsync.com" });

    if (!demoShop) {
      return res.status(404).json({ message: "Demo account not available" });
    }

    const token = jwt.sign(
      { shopId: demoShop._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }, // shorter expiry for demo, since it's public
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Demo login successful",
        shopName: demoShop.shopName,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error starting demo session" });
  }
};

const authMe = async (req, res) => {
  try {
    const shop = await Shop.findById(req.shop._id).select("-password");

    if (!shop) {
      return res.status(404).json({
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      shopId: shop._id,
      shopName: shop.shopName,
      ownerName: shop.ownerName,
      phoneNumber: shop.phoneNumber,
      email: shop.email,
      address: shop.address,
      status: shop.status,
    });
  } catch (error) {
    console.error("Auth Me Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = { RegisterShop, LoginShop, LogoutShop, DemoLogin, authMe };
