import axios from "axios";

// Create an Axios instance with default configuration
export const apiInstance = axios.create({
  baseURL: "https://api.example.com", // Replace with your actual API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      // Redirect to login page if needed
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
