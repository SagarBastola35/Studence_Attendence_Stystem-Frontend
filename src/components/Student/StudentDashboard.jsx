import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaCalendarCheck,
  FaClock,
  FaChartLine,
  FaBookOpen,
} from "react-icons/fa";
import LoadingSpinner from "../Common/LoadingSpinner";

const StudentDashboard = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const { data } = await axios.get("/api/attendance/my-attendance");
      setAttendance(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const pieData = attendance?.statistics
    ? [
        {
          name: "Present",
          value: attendance.statistics.present,
          color: "#10B981",
        },
        { name: "Late", value: attendance.statistics.late, color: "#F59E0B" },
        {
          name: "Excused",
          value: attendance.statistics.excused,
          color: "#3B82F6",
        },
        {
          name: "Absent",
          value: attendance.statistics.absent,
          color: "#EF4444",
        },
      ]
    : [];

  const courseData = Object.entries(attendance?.courseWiseStats || {}).map(
    ([course, stats]) => ({
      name: course,
      Present: stats.present,
      Late: stats.late,
      Absent: stats.absent,
    }),
  );

  const monthlyData =
    attendance?.attendance
      ?.slice(0, 30)
      .reverse()
      .map((record) => ({
        date: new Date(record.date).toLocaleDateString(),
        status:
          record.status === "present" ? 1 : record.status === "late" ? 0.5 : 0,
      })) || [];

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
            My Attendance Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your attendance performance
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="dashboard-card bg-linear-to-br from-green-500 to-green-700">
            <FaCalendarCheck className="text-3xl mb-3" />
            <div className="text-3xl font-bold">
              {attendance?.statistics?.present || 0}
            </div>
            <div className="text-sm opacity-90">Present Days</div>
          </div>

          <div className="dashboard-card bg-linear-to-br from-yellow-500 to-yellow-700">
            <FaClock className="text-3xl mb-3" />
            <div className="text-3xl font-bold">
              {attendance?.statistics?.late || 0}
            </div>
            <div className="text-sm opacity-90">Late Arrivals</div>
          </div>

          <div className="dashboard-card bg-linear-to-br from-blue-500 to-blue-700">
            <FaChartLine className="text-3xl mb-3" />
            <div className="text-3xl font-bold">
              {attendance?.statistics?.attendancePercentage || 0}%
            </div>
            <div className="text-sm opacity-90">Attendance Rate</div>
          </div>

          <div className="dashboard-card bg-linear-to-br from-purple-500 to-purple-700">
            <FaBookOpen className="text-3xl mb-3" />
            <div className="text-3xl font-bold">
              {Object.keys(attendance?.courseWiseStats || {}).length}
            </div>
            <div className="text-sm opacity-90">Active Courses</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">
              Attendance Distribution
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

          {/* Course-wise Bar Chart */}
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

          {/* Recent Attendance Trend */}
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4">
              Recent Attendance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
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
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
