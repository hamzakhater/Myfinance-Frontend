import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// جلب التوكن من localStorage
const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// تسجيل مستخدم جديد
export const signupUser = async (userData) => {
  const res = await axiosInstance.post("/auth/signup", userData);
  return res.data;
};

// تسجيل الدخول
export const loginUser = async (credentials) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data;
};

export default axiosInstance;
