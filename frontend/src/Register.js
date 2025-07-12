import React, { useState } from "react";
import axios from "axios";

const Register = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://photo-gallery-i9xr.onrender.com/api/users/register", {
        name,
        email,
        password,
      });

      const { token } = res.data;
      localStorage.setItem("token", token);
      setMessage("Registered successfully!");
      onRegister(); // switch to gallery after register
    } catch (err) {
      console.error("Register error:", err);
      setMessage("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: "300px", margin: "auto", padding: "20px" }}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
  );
};

export default Register;
