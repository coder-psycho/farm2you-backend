// get-orders-by-farmer.js (API route)
const Order = require("../../models/Order");
const asyncWrapper = require("../../middleware/async");
const jwt = require("jsonwebtoken");

const getOrdersByFarmer = asyncWrapper(async (req, res) => {
  

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ type: "error", message: "Unauthorized" });

  const verification = jwt.verify(token, process.env.JWT_SECRET_KEY);

  console.log(verification.userId)

  // Query orders where any cartItem.user matches farmerId
const orders = await Order.find({ "cartItems.user._id": verification.userId })
  .populate("user")
  .populate("transporter");

    console.log(orders)
  return res.status(200).json({
    type: "success",
    orders,
  });
});

module.exports = getOrdersByFarmer;
