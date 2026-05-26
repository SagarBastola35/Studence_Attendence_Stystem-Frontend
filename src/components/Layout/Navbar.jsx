import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaUserGraduate,
  FaChartLine,
  FaCalendarCheck,
  FaUsers,
  FaBook,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const navLinks = [
    { path: "/", label: "Home", icon: null },
    ...(isAuthenticated
      ? [
          {
            path: isAdmin ? "/admin/dashboard" : "/student/dashboard",
            label: "Dashboard",
            icon: <FaChartLine className="mr-2" />,
          },
          ...(isAdmin
            ? [
                {
                  path: "/admin/add-attendance",
                  label: "Mark Attendance",
                  icon: <FaCalendarCheck className="mr-2" />,
                },
                {
                  path: "/admin/manage-students",
                  label: "Manage Students",
                  icon: <FaUsers className="mr-2" />,
                },
                {
                  path: "/admin/manage-courses",
                  label: "Manage Courses",
                  icon: <FaBook className="mr-2" />,
                },
              ]
            : [
                {
                  path: "/student/attendance",
                  label: "My Attendance",
                  icon: <FaCalendarCheck className="mr-2" />,
                },
              ]),
          {
            path: "/profile",
            label: "Profile",
            icon: <FaUserCircle className="mr-2" />,
          },
        ]
      : [
          { path: "/login", label: "Login", icon: null },
          { path: "/register", label: "Register", icon: null },
        ]),
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaUserGraduate className="text-primary-600 text-2xl" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              AttendFlow
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-primary-50 focus:outline-none"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
