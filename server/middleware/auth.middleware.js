import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Authentication middleware
const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is present and formatted as "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    // Verify token using secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user ID to request object
    req.user = decoded.id;

    next(); // proceed to the next middleware/route
  } catch {
    // Token is invalid or expired
    return res.status(401).json({ error: "Token is not valid or expired" });
  }
};

export default auth;
