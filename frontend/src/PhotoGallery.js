import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/photos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPhotos(res.data);
      } catch (err) {
        console.error("Error fetching photos:", err.message);
      }
    };
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/photos/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Upload successful!");
      window.location.reload(); // Reload to show new image
    } catch (err) {
      console.error("Upload failed:", err.message);
    }
  };

  return (
    <div>
      <h2>Photo Gallery</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Photo</button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "20px" }}>
        {photos.map((photo) => (
          <img
            key={photo._id}
            src={`data:${photo.image.contentType};base64,${Buffer.from(photo.image.data.data).toString("base64")}`}
            alt="Uploaded"
            style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
