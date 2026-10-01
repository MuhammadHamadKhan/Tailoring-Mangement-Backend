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
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use("/api/auth", authRoute);
app.use("/api/customer", customerRoute);
app.use("/api/order", orderRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/shop", shopRoutes);
module.exports = app;
