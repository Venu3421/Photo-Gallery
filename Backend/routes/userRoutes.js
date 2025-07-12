const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,   // ✅ Add this
  resetPassword     // ✅ Already added correctly
} = require("../controllers/userController"); // or authController if you've split

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot", forgotPassword);        // ✅ Add this line
router.post("/reset/:token", resetPassword);   // ✅ Already present

module.exports = router;
