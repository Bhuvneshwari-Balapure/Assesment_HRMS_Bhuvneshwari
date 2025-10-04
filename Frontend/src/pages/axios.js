// src/axios.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Axios instance with global settings
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 50000, // 🔥 global timeout set here
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
