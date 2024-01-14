import mongoose from "mongoose";
import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import PasswordReset from "../models/PasswordReset.js";

export const changePassword = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const hashedpassword = await hashString(password);

    const user = await Users.findByIdAndUpdate(
      { _id: userId },
      { password: hashedpassword }
    );
    if (user) {
      await PasswordReset.findOneAndDelete({ userId });

      res.status(200).json({
        ok: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const signUp = async (req, res,next) => {
  const { firstName, lastName, email,phoneNo, password } = req.body;

  // validate fields
  if (!(firstName || lastName || email || password)) {
    next("Provide Required Fields!");
    return;
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Email Address already exists");
      return;
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      phoneNo,
      password: hashedPassword,
    });

    // Remove sensitive information before sending the response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};


//login 
export const login = async (req, res,next) => {
  const { email, password } = req.body;

  try {
    // validation
    if (!email || !password) {
      next("Please Provide User Credentials");
      return;
    }

    // find user by email
    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      next("Invalid email or password");
      return;
    }

    // compare password
    const isMatch = await compareString(password, user?.password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    // Remove sensitive information before sending the response
    user.password = undefined;

    const token = createJWT(user?._id);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};


export const updateUserAsPro = async (req, res) => {
  try {
     // Use req.user.userId from the middleware

    const {userId, location, category, feesPerHour } = req.body;

    // Check if the user already exists
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update user data with pro information
    user.isPro = true;
    user.location = location || null;
    user.category = category || null;
    user.feesPerHour = feesPerHour || 100; // Default value, adjust as needed

    // Save the updated user data to the database
    const updatedUser = await user.save();

    // Optionally, you can send the updated user data in the response
    res.status(200).json({
      success: true,
      message: 'User updated as Pro successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const logout = async (req, res, next) => {
  try {
    // Optionally, you may want to add some additional logic here
    // For example, you might want to add the token to a blacklist to prevent token reuse

    // Clear the JWT cookie
    res.clearCookie('jwtToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
