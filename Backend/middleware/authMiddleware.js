const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next(); // ✅ Exit after successful auth
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // ✅ This now only runs if no token is present
  return res.status(401).json({ message: "Not authorized, no token" });
};

module.exports = protect;
