// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../services/api";

// const Login = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await axiosInstance.post("/Authentication/login", {
//         username,
//         password,
//       });

//       if (response.data.status?.status) {
//         // تخزين التوكن في localStorage
//         localStorage.setItem("token", response.data.data.token);

//         // التوجيه للداشبورد
//         navigate("/dashboard");
//       } else {
//         setError(response.data.status?.message || "Login failed");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(
//         err.response?.data?.status?.message || "Login failed. Try again."
//       );
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import axiosInstance from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/Authentication/login", {
        email,
        password,
      });

      if (res.data.status.status) {
        // تخزين بيانات المستخدم في localStorage
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        localStorage.setItem("token", res.data.data.token);

        // الانتقال إلى Dashboard بعد تسجيل الدخول
        navigate("/dashboard");
      } else {
        setError(res.data.status.message);
      }
    } catch (err) {
      setError(err.response?.data?.status?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}
