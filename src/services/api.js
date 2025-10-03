// // import axios from "axios";

// // // رابط الباك اند المحلي
// // const API_URL = "http://localhost:5000";

// // // ========================
// // // إدارة الـ JWT Token
// // // ========================
// // const setAuthToken = (token) => {
// //   if (token) {
// //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// //   } else {
// //     delete axios.defaults.headers.common["Authorization"];
// //   }
// // };

// // // ========================
// // // Authentication
// // // ========================
// // export const signupUser = async (userData) => {
// //   return await axios.post(`${API_URL}/Authentication/signup`, userData);
// // };

// // export const loginUser = async (userData) => {
// //   const response = await axios.post(
// //     `${API_URL}/Authentication/login`,
// //     userData
// //   );
// //   if (response.data.token) {
// //     // تخزين الـ token في localStorage
// //     localStorage.setItem("token", response.data.token);
// //     setAuthToken(response.data.token);
// //   }
// //   return response;
// // };

// // // ========================
// // // Expenses
// // // ========================
// // export const addExpense = async (expenseData) => {
// //   setAuthToken(localStorage.getItem("token"));
// //   return await axios.post(`${API_URL}/Expenses/add`, expenseData);
// // };

// // export const getExpenses = async () => {
// //   setAuthToken(localStorage.getItem("token"));
// //   return await axios.get(`${API_URL}/Expenses/get`);
// // };

// // export const getTotalExpenses = async () => {
// //   setAuthToken(localStorage.getItem("token"));
// //   return await axios.get(`${API_URL}/Expenses/getTotol`);
// // };

// // export const getAverageExpenses = async () => {
// //   setAuthToken(localStorage.getItem("token"));
// //   return await axios.get(`${API_URL}/Expenses/getAverage`);
// // };

// // export const getTypesExpenses = async () => {
// //   setAuthToken(localStorage.getItem("token"));
// //   return await axios.get(`${API_URL}/Expenses/getTypesexpenses`);
// // };

// // // ========================
// // // Incomes
// // // ========================
// // export const addIncome = async (incomeData) => {
// //   setAuthToken(localStorage.getItem("token"));
// //   return await axios.post(`${API_URL}/Incomes/add`, incomeData);
// // };

// // export const getRemainingIncome = async () => {
// //   setAuthToken(localStorage.getItem("token"));
// //   return await axios.get(`${API_URL}/Incomes/getremaining`);
// // };

// // // ========================
// // // Logout
// // // ========================
// // export const logoutUser = () => {
// //   localStorage.removeItem("token");
// //   setAuthToken(null);
// // };

// import axios from "axios";

// const API_URL = "http://localhost:5000"; // يجب أن يكون هو نفس السيرفر اللي Backend شغال عليه

// // إنشاء نسخة Axios
// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // إضافة Token تلقائيًا لكل الطلبات المحمية
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token"); // استرجاع Token
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosInstance;

import axios from "axios";

const API_URL = "http://localhost:5000"; // رابط الباك

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
