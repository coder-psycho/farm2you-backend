const mongoose = require('mongoose')
const { Schema } = mongoose;

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
  }
}, { timestamps: true });



module.exports = mongoose.model("User", users);