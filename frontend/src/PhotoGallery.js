import React, { useState, useEffect } from "react";
import axios from "axios";

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://photo-gallery-i9xr.onrender.com/api/photos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📷 Photos from server:", res.data);
      setPhotos(res.data);
    };

    fetchPhotos();
  }, []);
  const handleDelete = async (photoId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this photo?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");
    await axios.delete(`https://photo-gallery-i9xr.onrender.com/api/photos/${photoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setPhotos(photos.filter((p) => p._id !== photoId));
  } catch (err) {
    alert("Failed to delete photo");
    console.error(err);
  }
};


  return (
    <div>
      <h2>Photo Gallery</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {photos.map((photo) => (
  <div key={photo._id} style={{ position: "relative" }}>
    <img
      src={photo.url}
      alt="Uploaded"
      style={{ width: "200px", height: "auto", cursor: "pointer" }}
      onClick={() => setSelectedPhoto(photo.url)}
    />
    <button
      onClick={() => handleDelete(photo._id)}
      style={{
        position: "absolute",
        top: "5px",
        right: "5px",
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      ✕
    </button>
  </div>
))}

      </div>

      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={selectedPhoto}
            alt="Full view"
            style={{ maxHeight: "90%", maxWidth: "90%", borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
