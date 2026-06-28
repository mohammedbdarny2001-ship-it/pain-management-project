const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor","admin"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
    },
    diagnosis: {
      type: String,
      default: "",
    },
    physician: {
      type: String,
      default: "",
    },
    specialization: {
  type: String,
  default: "",
},
phone: {
  type: String,
  default: "",
},
email: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);