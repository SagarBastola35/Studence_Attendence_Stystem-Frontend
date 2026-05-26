import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBook } from "react-icons/fa";
import toast from "react-hot-toast";
import LoadingSpinner from "../Common/LoadingSpinner";

// Create axios instance with correct base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    credits: 3,
    instructor: "",
    department: "",
    semester: 1,
    isActive: true,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/users/courses");
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate numeric fields
    const creditsNum = parseInt(formData.credits);
    const semesterNum = parseInt(formData.semester);

    if (isNaN(creditsNum) || creditsNum < 1 || creditsNum > 6) {
      toast.error("Credits must be a number between 1 and 6");
      return;
    }

    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      toast.error("Semester must be a number between 1 and 8");
      return;
    }

    const courseData = {
      courseCode: formData.courseCode,
      courseName: formData.courseName,
      credits: creditsNum,
      instructor: formData.instructor,
      department: formData.department,
      semester: semesterNum,
      isActive: formData.isActive,
    };

    try {
      if (editingCourse) {
        await api.put(`/users/courses/${editingCourse._id}`, courseData);
        toast.success("Course updated successfully");
      } else {
        await api.post("/users/courses", courseData);
        toast.success("Course created successfully");
      }
      fetchCourses();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/users/courses/${id}`);
        toast.success("Course deleted successfully");
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Failed to delete course");
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      courseCode: course.courseCode || "",
      courseName: course.courseName || "",
      credits: course.credits || 3,
      instructor: course.instructor || "",
      department: course.department || "",
      semester: course.semester || 1,
      isActive: course.isActive !== undefined ? course.isActive : true,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      courseCode: "",
      courseName: "",
      credits: 3,
      instructor: "",
      department: "",
      semester: 1,
      isActive: true,
    });
  };

  // Handle number input changes safely
  const handleNumberChange = (field, value) => {
    if (value === "") {
      setFormData({ ...formData, [field]: "" });
    } else {
      const num = parseInt(value);
      if (!isNaN(num)) {
        setFormData({ ...formData, [field]: num });
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-gray-600 mt-2">Add, edit, or remove courses</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center cursor-pointer"
          >
            <FaPlus className="mr-2" /> Add Course
          </button>
        </div>

        {/* Search Bar */}
        <div className="card p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by course code, name, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <motion.div
              key={course._id}
              whileHover={{ scale: 1.02 }}
              className="card p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <FaBook className="text-primary-500 text-2xl mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {course.courseName}
                    </h3>
                    <p className="text-sm text-gray-500">{course.courseCode}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Instructor:</span>{" "}
                  {course.instructor}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Department:</span>{" "}
                  {course.department}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Credits:</span> {course.credits}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Semester:</span>{" "}
                  {course.semester}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      course.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {course.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-8 text-gray-500">No courses found</div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-4">
                {editingCourse ? "Edit Course" : "Add Course"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.courseCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        courseCode: e.target.value.toUpperCase(),
                      })
                    }
                    className="input-field"
                    placeholder="e.g., CS101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.courseName}
                    onChange={(e) =>
                      setFormData({ ...formData, courseName: e.target.value })
                    }
                    className="input-field"
                    placeholder="e.g., Introduction to Programming"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credits (1-175)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    step="1"
                    required
                    value={formData.credits}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setFormData({ ...formData, credits: "" });
                      } else {
                        const num = parseInt(value);
                        if (!isNaN(num) && num >= 1 && num <= 6) {
                          setFormData({ ...formData, credits: num });
                        }
                      }
                    }}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    className="input-field"
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="input-field"
                    placeholder="Computer Science"
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
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setFormData({ ...formData, semester: "" });
                      } else {
                        const num = parseInt(value);
                        if (!isNaN(num) && num >= 1 && num <= 8) {
                          setFormData({ ...formData, semester: num });
                        }
                      }
                    }}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active Course</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="btn-secondary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary cursor-pointer">
                    {editingCourse ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ManageCourses;
