import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaFilter, FaDownload, FaEye } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
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

const AttendanceView = () => {
  const [attendance, setAttendance] = useState(null);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchAttendance();
    fetchCourses();
  }, []);

  useEffect(() => {
    filterAttendance();
  }, [attendance, selectedCourse, startDate, endDate]);

  const fetchAttendance = async () => {
    try {
      console.log("Fetching attendance...");
      const { data } = await api.get("/attendance/my-attendance");
      console.log("Attendance data:", data);
      setAttendance(data);
      setFilteredAttendance(data.attendance || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Failed to load attendance data");
      // Set empty data to avoid errors
      setAttendance({
        attendance: [],
        statistics: {
          totalClasses: 0,
          present: 0,
          late: 0,
          excused: 0,
          absent: 0,
          attendancePercentage: 0,
        },
        courseWiseStats: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      console.log("Fetching courses...");
      const { data } = await api.get("/users/courses");
      console.log("Courses data:", data);
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Failed to load courses");
      setCourses([]);
    }
  };

  const filterAttendance = () => {
    if (!attendance?.attendance) return;

    let filtered = [...attendance.attendance];

    if (selectedCourse !== "all") {
      filtered = filtered.filter(
        (record) => record.course?._id === selectedCourse,
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (record) => new Date(record.date) >= new Date(startDate),
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (record) => new Date(record.date) <= new Date(endDate),
      );
    }

    setFilteredAttendance(filtered);
  };

  const exportToCSV = () => {
    if (filteredAttendance.length === 0) {
      toast.error("No attendance records to export");
      return;
    }

    const headers = ["Date", "Course", "Status", "Session Type", "Remarks"];
    const rows = filteredAttendance.map((record) => [
      new Date(record.date).toLocaleDateString(),
      record.course?.courseName || "N/A",
      record.status || "N/A",
      record.sessionType || "theory",
      record.remarks || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Report downloaded successfully");
  };

  if (loading) return <LoadingSpinner />;

  // Prepare chart data
  const monthlyData = filteredAttendance
    .slice(0, 30)
    .reverse()
    .map((record) => ({
      date: new Date(record.date).toLocaleDateString(),
      status:
        record.status === "present" ? 100 : record.status === "late" ? 50 : 0,
    }));

  const courseData = Object.entries(attendance?.courseWiseStats || {}).map(
    ([course, stats]) => ({
      name: course,
      Present: stats.present || 0,
      Late: stats.late || 0,
      Absent: stats.absent || 0,
    }),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            My Attendance Records
          </h1>
          <p className="text-gray-600 mt-2">
            View and track your attendance history
          </p>
        </div>

        {/* Statistics Summary */}
        {attendance?.statistics && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {attendance.statistics.present || 0}
                </div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {attendance.statistics.late || 0}
                </div>
                <div className="text-sm text-gray-600">Late</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {attendance.statistics.excused || 0}
                </div>
                <div className="text-sm text-gray-600">Excused</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {attendance.statistics.absent || 0}
                </div>
                <div className="text-sm text-gray-600">Absent</div>
              </div>
            </div>

            {/* Overall Attendance Percentage */}
            <div className="card p-6 text-center">
              <div className="text-4xl font-bold text-primary-600">
                {attendance.statistics.attendancePercentage || 0}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Overall Attendance Percentage
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${attendance.statistics.attendancePercentage || 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </>
        )}

        {/* Filters */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaFilter className="mr-2" /> Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="input-field"
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={exportToCSV}
              className="btn-primary flex items-center cursor-pointer"
            >
              <FaDownload className="mr-2" /> Export to CSV
            </button>
          </div>
        </div>

        {/* Charts */}
        {monthlyData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">
                Recent Attendance Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="status"
                    stroke="#6366f1"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {courseData.length > 0 && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Course-wise Performance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={courseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Present" fill="#10B981" />
                    <Bar dataKey="Late" fill="#F59E0B" />
                    <Bar dataKey="Absent" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Attendance Table */}
        <div className="card overflow-x-auto">
          <h3 className="text-xl font-semibold p-6 pb-0">Attendance Records</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Session Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.course?.courseName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          record.status === "present"
                            ? "bg-green-100 text-green-800"
                            : record.status === "late"
                              ? "bg-yellow-100 text-yellow-800"
                              : record.status === "excused"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.sessionType || "theory"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.remarks || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AttendanceView;
