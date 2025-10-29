import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; // دالة API الخاصة بتسجيل الدخول
import { Spinner } from "react-bootstrap";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      if (res.status) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Welcome Back</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            {loading && (
              <Spinner animation="border" size="sm" className="me-2" />
            )}
            Login
          </button>
        </form>

        <div className="d-flex justify-content-between mt-3">
          <span
            style={{ color: "#0d6efd", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>

          <span
            style={{ color: "#0d6efd", cursor: "pointer" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </div>
      </div>
    </div>
  );
}
