const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  price: {
    type: Number
  },
  description: {
    type: String
  },
  images: {
    type: [String], 
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
