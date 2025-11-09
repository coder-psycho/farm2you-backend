const User = require("../../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const asyncWrapper = require("../../middleware/async");
const connectDB = require("../../db/connect");
const Order = require("../../models/Order");
const axios = require("axios")


const getTransporterOrders = asyncWrapper(async (req, res) => {
  // Verify user token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ type: "error", message: "Unauthorized" });

  const verification = jwt.verify(token, process.env.JWT_SECRET_KEY);

  console.log(verification.userId)

  let orders = await Order.find({
    transporter: verification.userId
  }).populate("user").populate("transporter")

  console.log(orders)


  return res.status(200).json({
    type: "success",
    orders: orders
  });
});

module.exports = getTransporterOrders;
