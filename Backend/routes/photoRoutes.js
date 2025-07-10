const express = require("express");
const router = express.Router();
const multer = require("multer");
const Photo = require("../models/Photo");
const protect = require("../middleware/authMiddleware");
router.get("/test", (req, res) => {
  res.send("📷 Photo route is active!");
});


// Set up Multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload a photo
router.post("/upload", protect, upload.single("photo"), async (req, res) => {
  try {
    const photo = new Photo({
      user: req.user._id,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await photo.save();
    res.status(201).json({ message: "Photo uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all photos of logged-in user
router.get("/", protect, async (req, res) => {
  try {
    console.log("GET /api/photos was called");

    const photos = await Photo.find({ user: req.user._id });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
