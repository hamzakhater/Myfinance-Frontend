// import axios from "axios";

// const API_URL = "http://localhost:5000"; // رابط الباك

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // إضافة التوكن تلقائياً لكل طلب
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosInstance;
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // عدل حسب رابط السيرفر

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// تسجيل الدخول
export const loginUser = async (credentials) => {
  const res = await axiosInstance.post("/Authentication/login", credentials);
  return res.data;
};

// تسجيل مستخدم جديد
export const signupUser = async (userData) => {
  const res = await axiosInstance.post("/Authentication/signup", userData);
  return res.data;
};

// جلب الدخل
export const getIncomes = async () => {
  const res = await axiosInstance.get("/Incomes/getAll");
  return res.data.data || [];
};

// جلب المصاريف
export const getExpenses = async () => {
  const res = await axiosInstance.get("/Expenses/getAll");
  return res.data.data || [];
};

export default axiosInstance;
