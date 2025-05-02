import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust your base URL if needed
  withCredentials: true,
});

// Add a request interceptor to include the token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach the token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
