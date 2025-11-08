const mongoose = require('mongoose')
const { Schema } = mongoose;

const addressSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  fullAddress: { type: String, required: true },
});

const users = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'farmer', 'transporter'],
    required: true
  },
   address: addressSchema
}, { timestamps: true });



module.exports = mongoose.model("User", users);