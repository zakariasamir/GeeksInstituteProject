const monngoose = require("mongoose");
const userScema = new monngoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["manager", "employee"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = monngoose.model("User", userScema);
module.exports = User;
