const Photo = require("../models/Photo");

// @desc Upload a photo
// @route POST /api/photos
// @access Private
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const photo = await Photo.create({
      user: req.user._id,
      url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    });

    res.status(201).json(photo);
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get all photos
// @route GET /api/photos
// @access Public or Private
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    console.error("Get photos error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
