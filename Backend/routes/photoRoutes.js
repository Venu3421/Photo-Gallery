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
    photos.forEach((p) => {
      if (!p.image || !p.image.data) {
        console.warn("⚠️ Skipping malformed photo:", p._id);
      }
    });

    // Convert buffer to base64 string
    const formattedPhotos = photos
  .filter((photo) => photo.image && photo.image.data) // ✅ filter out bad ones
  .map((photo) => ({
    _id: photo._id,
    url: `data:${photo.image.contentType};base64,${photo.image.data.toString("base64")}`,
  }));


    res.json(formattedPhotos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE a photo by ID
router.delete("/:id", protect, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) return res.status(404).json({ message: "Photo not found" });

    if (photo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await photo.deleteOne();
    res.json({ message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
