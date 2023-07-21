const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: {
    type: String,
  },

  firstName: {
    type: String,
    required: [true, "Enter First Name"],
  },
  lastName: {
    type: String,
    required: [true, "Enter Last Name"],
  },
  phone: {
    type: String,
    required: [true, "Phone no is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
  },
  website: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Address is Required"],
  },
  specialization: {
    type: String,
    required: [true, "Specilization  is Required"],
  },
  experience: {
    type: Number,
    required: [true, "experience  is Required"],
  },

  fess: {
    type: Number,
    required: [true, "Fee is Required"],
  },
  status: {
    type: "String",
    default: "pending",
  },
  timing: {
    type: Object,
    required: [true, "Work time is Required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("doctors", doctorSchema);
