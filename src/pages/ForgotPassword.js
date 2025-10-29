import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/api";
import { Spinner } from "react-bootstrap";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });

      if (res.data.status) {
        // إعادة التوجيه مباشرة إلى صفحة Reset Password باستخدام التوكن
        if (res.data.resetToken) {
          navigate(`/reset-password/${res.data.resetToken}`);
        }
      } else {
        setError(res.data.message || "Failed to generate reset token.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error. Try again.");
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
        <h2 className="text-center mb-4">Forgot Password</h2>

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

          <button
            type="submit"
            className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            {loading && (
              <Spinner animation="border" size="sm" className="me-2" />
            )}
            Send Reset Link
          </button>
        </form>

        <p
          className="mt-3 text-center"
          style={{ cursor: "pointer", color: "#0d6efd" }}
          onClick={() => navigate("/")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}
