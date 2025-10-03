import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // إرسال البيانات للباك
      const response = await axiosInstance.post("/Authentication/login", {
        username,
        password,
      });

      if (response.data.data) {
        // تخزين الـ JWT Token في localStorage
        localStorage.setItem("token", response.data.data);

        // تسجيل الدخول ناجح، التوجيه للـ Dashboard
        navigate("/dashboard");
      } else {
        setError(response.data.status?.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.status?.message || "Login failed.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
