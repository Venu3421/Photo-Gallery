const express = require("express");
const router = express.Router();
const multer = require("multer");
const Photo = require("../models/Photo");
const protect = require("../middleware/authMiddleware");

// Multer memory storage (store image in buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload a photo (buffer)
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
    res.status(201).json({ message: "Photo uploaded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all photos of the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const photos = await Photo.find({ user: req.user._id });

    // Convert buffer to base64 string
    const formattedPhotos = photos.map((photo) => ({
      _id: photo._id,
      url: `data:${photo.image.contentType};base64,${photo.image.data.toString("base64")}`,
    }));

    res.json(formattedPhotos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
