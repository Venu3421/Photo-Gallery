import React, { useState } from "react";
import axios from "axios";

const UploadPhoto = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await axios.post(
        "https://photo-gallery-i9xr.onrender.com/api/photos/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Photo uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Upload failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleUpload} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 style={{ marginBottom: "10px" }}>📤 Upload Photo</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
      <button type="submit" style={{ marginTop: "10px" }}>Upload</button>
      {message && <p style={{ marginTop: "12px", color: "green" }}>{message}</p>}
    </form>
  );
};

export default UploadPhoto;
