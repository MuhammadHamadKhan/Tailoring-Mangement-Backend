const app = require("../src/app");
const connectDB = require("../src/config/db");

module.exports = async (req, res) => {
  // Let CORS answer preflight requests without waiting for MongoDB.
  if (req.method === "OPTIONS") {
    return app(req, res);
  }

  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Database connection failed", error);
    return res.status(500).json({ message: "Database connection failed" });
  }
};
