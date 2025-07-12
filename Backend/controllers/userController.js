const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// LOGIN
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

};
// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        const resetLink = `https://photo-gallery-frontend-uttn.onrender.com/reset-${token}`; // Update this with your frontend URL

        // For now: log the link to the console
        console.log("🔐 Reset link:", resetLink);

        // In real case, send email using nodemailer here

        res.json({ message: "Reset link sent to email (check console)" });
    } catch (err) {
        console.error("Forgot password error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by decoded ID
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new password
        user.password = hashedPassword;
        await user.save();

        // Respond success
        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error("Reset password error:", err.message);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};


