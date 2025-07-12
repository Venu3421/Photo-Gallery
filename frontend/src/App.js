import React, { useState } from "react";
import PhotoGallery from "./PhotoGallery";
import UploadPhoto from "./UploadPhoto";
import Login from "./Login";
import Register from "./Register";
import './App.css';
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [view, setView] = useState(isLoggedIn ? "gallery" : "login");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setView("login");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setView("gallery");
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", maxWidth: "960px", margin: "auto" }}>
      <nav style={{ marginBottom: "20px" }}>
        {isLoggedIn ? (
          <>
            <button onClick={() => setView("gallery")} style={{ marginRight: "10px" }}>Gallery</button>
            <button onClick={() => setView("upload")} style={{ marginRight: "10px" }}>Upload</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => setView("login")} style={{ marginRight: "10px" }}>Login</button>
            <button onClick={() => setView("register")}>Register</button>
          </>
        )}
      </nav>

      {isLoggedIn && view === "gallery" && <PhotoGallery />}
      {isLoggedIn && view === "upload" && <UploadPhoto />}
      {!isLoggedIn && view === "login" && <Login onLogin={handleLoginSuccess} setView={setView} />}
      {!isLoggedIn && view === "forgot" && <ForgotPassword />}
{!isLoggedIn && view.startsWith("reset-") && (
   <ResetPassword token={view.split("reset-")[1]} setView={setView} />

)}

      {!isLoggedIn && view === "register" && <Register onRegister={() => setView("login")} />}
    </div>
  );
};

export default App;
