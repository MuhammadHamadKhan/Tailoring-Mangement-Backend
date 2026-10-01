require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/auth.routes");
const customerRoute = require("./routes/customer.route");
const orderRoute = require("./routes/orders.route");
const dashboardRoute = require("./routes/dashboardSummary");
const shopRoutes = require("./routes/setting.routes");
const app = express();

const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, "");
const allowedOrigins = new Set(
  [
    process.env.FRONT_END_URL,
    "https://tailoring-management-system-five.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ]
    .map(normalizeOrigin)
    .filter(Boolean),
);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use("/api/auth", authRoute);
app.use("/api/customer", customerRoute);
app.use("/api/order", orderRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/shop", shopRoutes);
module.exports = app;
