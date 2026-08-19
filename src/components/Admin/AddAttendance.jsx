import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaSearch, FaCheck, FaTimes, FaPlus } from "react-icons/fa";

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

const AddAttendance = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/users/students");
      console.log("Fetched students:", data);
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/users/courses");
      console.log("Fetched courses:", data);
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    console.log(`Marking student ${studentId} as ${status}`);
    setAttendanceData((prev) => {
      const newData = { ...prev, [studentId]: status };
      console.log("Updated attendanceData:", newData);
      return newData;
    });
  };

  const handleBulkMark = (status) => {
    console.log(`Bulk marking all as ${status}`);
    const newAttendance = {};
    filteredStudents.forEach((student) => {
      newAttendance[student._id] = status;
    });
    console.log("Bulk attendanceData:", newAttendance);
    setAttendanceData(newAttendance);
    toast.success(`Marked all as ${status}`);
  };

  const handleSubmit = async () => {
    console.log("Submitting attendance...");
    console.log("Selected course:", selectedCourse);
    console.log("Current attendanceData:", attendanceData);
    console.log("Students in state:", students);

    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    const markedCount = Object.keys(attendanceData).length;
    console.log("Marked count:", markedCount);
    
    if (markedCount === 0) {
      toast.error("Please mark attendance for at least one student");
      return;
    }

    setLoading(true);

    try {
      const selectedCourseData = courses.find((c) => c._id === selectedCourse);
      console.log("Selected course data:", selectedCourseData);

      if (!selectedCourseData) {
        toast.error("Selected course not found");
        setLoading(false);
        return;
      }

      const attendancePromises = [];
      
      for (const [studentId, status] of Object.entries(attendanceData)) {
        console.log(`Processing student ID: ${studentId}, Status: ${status}`);
        
        // IMPORTANT: Find student by matching _id (as string)
        const student = students.find((s) => String(s._id) === String(studentId));
        
        if (!student) {
          console.log(`Student not found for ID: ${studentId}`);
          console.log(`Available student IDs: ${students.map(s => s._id).join(', ')}`);
          continue;
        }
        
        if (!status) {
          console.log(`No status for student: ${studentId}`);
          continue;
        }
        
        console.log(`Found student: ${student.name} (${student.studentId})`);
        
        attendancePromises.push(
          api.post("/attendance/mark", {
            studentId: student.studentId,
            courseCode: selectedCourseData.courseCode,
            date: selectedDate,
            status: status,
            sessionType: "theory",
          })
        );
      }

      console.log(`Total promises to send: ${attendancePromises.length}`);

      if (attendancePromises.length === 0) {
        toast.error("No valid attendance records to submit");
        setLoading(false);
        return;
      }

      const results = await Promise.all(attendancePromises);
      console.log("Results:", results);
      
      const allSuccess = results.every((res) => res.data?.success === true);

      if (allSuccess) {
        toast.success(`Attendance marked successfully for ${attendancePromises.length} student(s)`);
        setAttendanceData({});
      } else {
        toast.error("Some attendance records failed to save");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (error.response?.status === 404) {
        toast.error("Student or course not found");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to mark attendance. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId?.includes(searchTerm),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-gray-600 mt-2">Record daily student attendance</p>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="input-field"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Student
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleBulkMark("present")}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
            >
              <FaCheck className="mr-2" /> Mark All Present
            </button>
            <button
              onClick={() => handleBulkMark("late")}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer"
            >
              <FaCheck className="mr-2" /> Mark All Late
            </button>
            <button
              onClick={() => handleBulkMark("absent")}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
            >
              <FaTimes className="mr-2" /> Mark All Absent
            </button>
          </div>
        </div>

        {/* Students List */}
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      Semester {student.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleAttendanceChange(student._id, "present")
                          }
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                            attendanceData[student._id] === "present"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-green-100 cursor-pointer"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() =>
                            handleAttendanceChange(student._id, "late")
                          }
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                            attendanceData[student._id] === "late"
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-yellow-100 cursor-pointer"
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() =>
                            handleAttendanceChange(student._id, "absent")
                          }
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                            attendanceData[student._id] === "absent"
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-red-100 cursor-pointer"
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FaPlus className="mr-2" />
            {loading ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddAttendance;
