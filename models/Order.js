const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
});

const customerInfoSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  phoneNumber: { type: String, required: true },
  email: { type: String },
});

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerInfo: customerInfoSchema,
    transporter: { type: Schema.Types.ObjectId, ref: "User", default: null },
    address: addressSchema,
    cartItems: { type: [Schema.Types.Mixed], default: [] },
    totalPrice: { type: Number, required: true },
    delivery: { type: Number, required: true },
    km: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
