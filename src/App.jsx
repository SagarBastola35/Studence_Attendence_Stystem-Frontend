import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/Common/PrivateRoute";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AddAttendance from "./components/Admin/AddAttendance";
import ManageStudents from "./components/Admin/ManageStudents";
import ManageCourses from "./components/Admin/ManageCourses";
import StudentDashboard from "./components/Student/StudentDashboard";
import AttendanceView from "./components/Student/AttendanceView";
import Profile from "./components/Student/Profile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-50 to-gray-100">
          <Navbar />
          <main className="grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute adminOnly>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/add-attendance"
                element={
                  <PrivateRoute adminOnly>
                    <AddAttendance />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/manage-students"
                element={
                  <PrivateRoute adminOnly>
                    <ManageStudents />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/manage-courses"
                element={
                  <PrivateRoute adminOnly>
                    <ManageCourses />
                  </PrivateRoute>
                }
              />
              <Route
                path="/student/dashboard"
                element={
                  <PrivateRoute studentOnly>
                    <StudentDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/student/attendance"
                element={
                  <PrivateRoute studentOnly>
                    <AttendanceView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

