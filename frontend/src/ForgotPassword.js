import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://photo-gallery-i9xr.onrender.com/api/users/forgot", { email });
      setMessage("Reset link sent. Check your inbox.");
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleRequest}>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <button type="submit">Send Reset Link</button>
      <p>{message}</p>
    </form>
  );
};

export default ForgotPassword;
