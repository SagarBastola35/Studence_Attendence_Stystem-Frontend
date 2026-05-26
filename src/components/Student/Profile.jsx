import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaGraduationCap,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../Common/LoadingSpinner";
import toast from "react-hot-toast";

// Create axios instance with correct base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    semester: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        course: user.course || "",
        semester: user.semester || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate semester if student
    if (user.role === "student") {
      const semesterNum = parseInt(formData.semester);
      if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
        toast.error("Semester must be between 1 and 8");
        return;
      }
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      // Only include student-specific fields if user is a student
      if (user.role === "student") {
        updateData.course = formData.course;
        updateData.semester = parseInt(formData.semester);
      }

      // Use user.id (not user._id) - backend uses "id" field
      const userId = user.id || user._id;
      console.log("Updating user ID:", userId);
      console.log("Updating profile with:", updateData);

      const response = await api.put(`/users/students/${userId}`, updateData);

      console.log("Update response:", response.data);

      if (response.data.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        // Update local user data
        user.name = formData.name;
        user.email = formData.email;
        if (user.role === "student") {
          user.course = formData.course;
          user.semester = parseInt(formData.semester);
        }
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      console.error("Error response:", error.response?.data);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
      } else if (error.response?.status === 404) {
        toast.error("User not found. Please try logging in again.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            View and manage your account information
          </p>
        </div>

        <div className="card overflow-hidden">
          <div className="h-32 bg-linear-to-r from-primary-500 to-primary-700"></div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col items-center -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full bg-primary-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                {getInitials(user.name)}
              </div>
              <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
              <p className="text-gray-600 capitalize">{user.role}</p>
            </div>

            {!isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-primary-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  {user.role === "student" && (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <FaIdCard className="text-primary-500 text-xl" />
                        <div>
                          <p className="text-sm text-gray-500">Student ID</p>
                          <p className="font-medium">{user.studentId}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <FaGraduationCap className="text-primary-500 text-xl" />
                        <div>
                          <p className="text-sm text-gray-500">Course</p>
                          <p className="font-medium">{user.course}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <FaCalendarAlt className="text-primary-500 text-xl" />
                        <div>
                          <p className="text-sm text-gray-500">Semester</p>
                          <p className="font-medium">
                            Semester {user.semester}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <FaUser className="text-primary-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-medium capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary flex items-center cursor-pointer"
                  >
                    <FaEdit className="mr-2" /> Edit Profile
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                {user.role === "student" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.course}
                        onChange={(e) =>
                          setFormData({ ...formData, course: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Semester (1-8)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        step="1"
                        required
                        value={formData.semester}
                        onChange={(e) =>
                          setFormData({ ...formData, semester: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary flex items-center cursor-pointer"
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center cursor-pointer"
                  >
                    <FaSave className="mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
