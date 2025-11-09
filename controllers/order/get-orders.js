const User = require("../../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const asyncWrapper = require("../../middleware/async");
const connectDB = require("../../db/connect");
const Order = require("../../models/Order");
const axios = require("axios")
require('dotenv').config();

const getDistance = async (user, farmer) => {
  console.log(user, farmer)
  if (!user || !farmer) {
    return;
  }
  const token = process.env.MAPBOX_TOKEN;
  console.log(token)
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${user.longitude},${user.latitude};${farmer.longitude},${farmer.latitude}?access_token=${token}`;

  const response = await axios.get(url);
  const route = response.data.routes[0];
  console.log(`Distance: ${route.distance / 1000} km`);
  console.log(`Duration: ${route.duration / 60} minutes`);
  let KM = route.distance / 1000
  return KM
}


const getOrders = asyncWrapper(async (req, res) => {
  // Verify user token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ type: "error", message: "Unauthorized" });

  const verification = jwt.verify(token, process.env.JWT_SECRET_KEY);

  let orders = await Order.find({
    user: verification.userId
  }).populate("user").populate("transporter")


  return res.status(200).json({
    type: "success",
    orders: orders
  });
});

module.exports = getOrders;
