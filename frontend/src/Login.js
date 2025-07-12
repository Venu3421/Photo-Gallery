import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLogin, setView }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://photo-gallery-i9xr.onrender.com/api/users/login", {
        email,
        password,
      });

      const { token } = res.data;
      localStorage.setItem("token", token);
      setMessage("Login successful!");
      onLogin(res.data.user); // ✅ Send user object to App.js
 // tell App.js to refresh

    } catch (err) {
      console.error("Login error:", err);
      setMessage("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: "300px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>
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
      <button type="submit">Login</button>
      <div style={{ marginTop: "10px" }}>
  <p>{message}</p>
  <p
    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
    onClick={() => setView("forgot")}
  >
    Forgot Password?
  </p>
</div>


    </form>
  );
};

export default Login;
