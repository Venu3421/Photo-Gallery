import React, { useState } from "react";
import axios from "axios";

const ResetPassword = ({ token, setView }) => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!token) {
    return <p>Invalid reset link.</p>;
  }

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://photo-gallery-i9xr.onrender.com/api/users/reset/${token}`, { password });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => setView("login"), 2000);
    } catch (err) {
      setMessage("Reset failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleReset}>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <button type="submit">Reset Password</button>
      <p>{message}</p>
    </form>
  );
};

export default ResetPassword;
