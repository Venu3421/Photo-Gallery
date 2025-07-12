const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 1. Hash token to match the stored one
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find matching user
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // 4. Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
