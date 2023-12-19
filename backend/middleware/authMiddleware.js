import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith('Bearer')) {
    return res.status(401).json({ success: false, message: 'Authentication 87failed' });
  }

  const token = authHeader?.split(' ')[1];

  try {
    const secretKey = process.env.JWT_SECRET; // Access the JWT secret key from environment variables

    if (!secretKey) {
      throw new Error("JWT secret key is missing in environment variables");
    }

    const decodedToken = jwt.verify(token, secretKey);

    req.user = {
      userId: decodedToken.userId,
    };

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

export default userAuth;
