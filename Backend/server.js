const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const photoRoutes = require("./routes/photoRoutes");


dotenv.config();
connectDB();

const app = express(); // ← MAKE SURE THIS COMES BEFORE app.use()

app.use(cors({
  origin: "https://photo-gallery-frontend-uttn.onrender.com",
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);
 // ← Now this will work
const protect = require("./middleware/authMiddleware");

app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

