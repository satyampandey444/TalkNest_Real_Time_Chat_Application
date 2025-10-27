import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.token;
    console.log("JWT Token:", token);

    if (!token) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token." });
    }


    req.userId = decoded.userId; 


    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication failed." });
  }
};

export default isAuthenticated;
