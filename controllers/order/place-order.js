const User = require("../../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const asyncWrapper = require("../../middleware/async");
const connectDB = require("../../db/connect");
const Order = require("../../models/Order");

const placeOrder = asyncWrapper(async (req, res) => {
  const { address, cartItems, price, delivery, customerInfo, km } = req.body;

  // Verify user token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ type: "error", message: "Unauthorized" });

  const verification = jwt.verify(token, process.env.JWT_SECRET_KEY);

  let newOrder = new Order({
    user: verification.userId,
    address,
    cartItems,
    totalPrice:price,
    delivery,
    customerInfo, // save customer info object
    km
  });

  await newOrder.save();

  return res.status(200).json({
    type: "success",
    message: "Order placed successfully",
    orderId: newOrder._id
  });
});

module.exports = placeOrder;
