import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// DIRECT HARDCODE - NO ENVIRONMENT VARIABLES
const API_URL = 'https://studence-attendence-stystem-backend-4.onrender.com/api';
axios.defaults.baseURL = API_URL;

console.log("🔐 FORCED API URL:", API_URL);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/auth/me");
      setUser(data);
    } catch (error) {
      console.error("Fetch user error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    try {
      console.log("Attempting login...");
      const { data } = await axios.post("/auth/login", { email, password });
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setToken(data.token);
      setUser(data);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      
      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to server. Please check if backend is running.");
      } else if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
      return false;
    }
  };

  const register = async (userData) => {
    try {
      console.log("Attempting registration...");
      const { data } = await axios.post("/auth/register", userData);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setToken(data.token);
      setUser(data);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      
      toast.success("Registration successful!");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isStudent: user?.role === "student",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
