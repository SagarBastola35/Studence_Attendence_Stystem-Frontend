import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaUsers, FaBook, FaCalendarCheck, FaChartLine } from "react-icons/fa";
import LoadingSpinner from "../Common/LoadingSpinner";
import toast from "react-hot-toast";

// Create an axios instance with the correct base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    todayAttendance: 0,
    monthlyAttendance: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data from:", "http://localhost:5000/api");

      const [statsRes, attendanceRes, studentsRes] = await Promise.all([
        api.get("/attendance/summary"),
        api.get("/attendance/all?limit=10"),
        api.get("/users/students"),
      ]);

      console.log("Stats:", statsRes.data);
      console.log("Attendance:", attendanceRes.data);
      console.log("Students:", studentsRes.data);

      setStats(statsRes.data);
      setRecentAttendance(attendanceRes.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      toast.error(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const attendanceData = [
    { name: "Today", count: stats?.todayAttendance || 0 },
    { name: "This Month", count: stats?.monthlyAttendance || 0 },
    { name: "Total Students", count: stats?.totalStudents || 0 },
  ];

  const pieData = [
    {
      name: "Present Today",
      value: stats?.todayAttendance || 0,
      color: "#10B981",
    },
    {
      name: "Absent Today",
      value: (stats?.totalStudents || 0) - (stats?.todayAttendance || 0),
      color: "#EF4444",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of attendance system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card bg-linear-to-br from-blue-500 to-blue-700"
          >
            <FaUsers className="text-3xl mb-3" />
            <div className="text-3xl font-bold">
              {stats?.totalStudents || 0}
            </div>
            <div className="text-sm opacity-90">Total Students</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card bg-linear-to-br from-green-500 to-green-700"
          >
            <FaBook className="text-3xl mb-3" />
            <div className="text-3xl font-bold">{stats?.totalCourses || 0}</div>
            <div className="text-sm opacity-90">Active Courses</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card bg-linear-to-br from-purple-500 to-purple-700"
          >
            <FaCalendarCheck className="text-3xl mb-3" />
            <div className="text-3xl font-bold">
              {stats?.todayAttendance || 0}
            </div>
            <div className="text-sm opacity-90">Today's Attendance</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card bg-linear-to-br from-orange-500 to-orange-700"
          >
            <FaChartLine className="text-3xl mb-3" />
            <div className="text-3xl font-bold">
              {stats?.monthlyAttendance || 0}
            </div>
            <div className="text-sm opacity-90">Monthly Attendance</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">Attendance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">
              Today's Attendance Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">
            Recent Attendance Records
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAttendance.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  recentAttendance.slice(0, 5).map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.student?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.course?.courseName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.date
                          ? new Date(record.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "late"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
