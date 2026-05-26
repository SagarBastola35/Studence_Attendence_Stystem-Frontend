import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }

    // Format error message
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    error.formattedMessage = message;

    return Promise.reject(error);
  },
);

// API service methods
export const authService = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),
  logout: () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  },
};

export const attendanceService = {
  markAttendance: (data) => api.post("/attendance/mark", data),
  bulkMarkAttendance: (data) => api.post("/attendance/bulk-mark", data),
  getMyAttendance: (params) => api.get("/attendance/my-attendance", { params }),
  getAllAttendance: (params) => api.get("/attendance/all", { params }),
  updateAttendance: (id, data) => api.put(`/attendance/${id}`, data),
  getSummary: () => api.get("/attendance/summary"),
};

export const userService = {
  getStudents: () => api.get("/users/students"),
  getStudentById: (id) => api.get(`/users/students/${id}`),
  updateStudent: (id, data) => api.put(`/users/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/users/students/${id}`),
  getCourses: () => api.get("/users/courses"),
  createCourse: (data) => api.post("/users/courses", data),
  updateCourse: (id, data) => api.put(`/users/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/users/courses/${id}`),
};

// Helper function to handle errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || "Server error occurred";
  } else if (error.request) {
    // Request was made but no response
    return "Network error - please check your connection";
  } else {
    // Something else happened
    return error.message || "An unexpected error occurred";
  }
};

// Export configured axios instance
export default api;