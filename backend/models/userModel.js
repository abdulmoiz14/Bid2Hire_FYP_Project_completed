import mongoose from "mongoose";

// Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required!"],
    },
    email: {
      type: String,
      required: [true, "Email is Required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 characters"],
      select: true,
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    loginAsPro: {
      type: Boolean,
      default: false,
    },
    feesPerHour: {
      type: String,
      default: "100",
    },
    category: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
