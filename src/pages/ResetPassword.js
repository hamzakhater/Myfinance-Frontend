import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/api";
import { Spinner } from "react-bootstrap";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // نفترض أن الرابط يحتوي على token
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/Authentication/reset-password", {
        token,
        password,
      });

      if (res.data.status?.status) {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000); // الانتقال للـ Login بعد ثانيتين
      } else {
        setError(res.data.status?.message || "Reset failed");
      }
    } catch (err) {
      setError(err.response?.data?.status?.message || "Network error");
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
        <h2 className="text-center mb-4">Reset Password</h2>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Reset Password
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
