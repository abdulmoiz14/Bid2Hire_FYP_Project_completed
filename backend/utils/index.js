import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashString = async (useValue) => {
  const salt = await bcrypt.genSalt(10);

  const hashedpassword = await bcrypt.hash(useValue, salt);
  return hashedpassword;
};

export const compareString = async (userPassword, password) => {
  const isMatch = await bcrypt.compare(userPassword, password);
  return isMatch;
};

export const createJWT = (userId) => {
  // Access the JWT secret key from the environment variables
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error("JWT secret key is missing in environment variables");
  }

  // Create a JWT token using the userId and your secret key
  const token = jwt.sign({ userId }, secretKey, { expiresIn: '3h' }); // You can adjust expiresIn as needed

  return token;
};
