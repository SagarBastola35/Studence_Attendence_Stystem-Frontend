

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Configure axios base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
axios.defaults.baseURL = API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      console.log("Fetching user data...");
      const { data } = await axios.get("/auth/me");
      console.log("User data fetched:", data);
      setUser(data);
    } catch (error) {
      console.error("Fetch user error:", error);

      // Handle different error types
      if (error.response) {
        // Server responded with error status
        console.error(
          "Server error:",
          error.response.status,
          error.response.data,
        );

        if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          logout();
        } else if (error.response.status === 502) {
          toast.error(
            "Backend server is not running. Please start the server.",
          );
        } else {
          toast.error(
            error.response.data?.message || "Failed to fetch user data",
          );
        }
      } else if (error.request) {
        // Request was made but no response
        console.error("No response from server:", error.request);
        toast.error(
          "Cannot connect to server. Please make sure backend is running on port 5000",
        );
      } else {
        // Something else happened
        console.error("Error:", error.message);
        toast.error("An error occurred. Please try again.");
      }

      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Attempting login...");
      const { data } = await axios.post("/auth/login", { email, password });
      console.log("Login successful:", data);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(data);
      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        if (error.response.status === 502) {
          toast.error(
            "Backend server is not running. Please start the server.",
          );
        } else {
          toast.error(error.response?.data?.message || "Login failed");
        }
      } else if (error.request) {
        toast.error(
          "Cannot connect to server. Please check if backend is running.",
        );
      } else {
        toast.error("Login failed. Please try again.");
      }

      return false;
    }
  };

  const register = async (userData) => {
    try {
      console.log("Attempting registration...");
      const { data } = await axios.post("/auth/register", userData);
      console.log("Registration successful:", data);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(data);
      toast.success("Registration successful!");
      return true;
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        if (error.response.status === 502) {
          toast.error(
            "Backend server is not running. Please start the server.",
          );
        } else {
          toast.error(error.response?.data?.message || "Registration failed");
        }
      } else if (error.request) {
        toast.error(
          "Cannot connect to server. Please check if backend is running.",
        );
      } else {
        toast.error("Registration failed. Please try again.");
      }

      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
