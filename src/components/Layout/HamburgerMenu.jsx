import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaChartLine,
  FaCalendarCheck,
  FaUsers,
  FaBook,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const menuItems = [
    ...(!isAuthenticated
      ? [
          { path: "/", label: "Home", icon: <FaHome /> },
          { path: "/login", label: "Login", icon: <FaSignInAlt /> },
          { path: "/register", label: "Register", icon: <FaUserPlus /> },
        ]
      : [
          { path: "/", label: "Home", icon: <FaHome /> },
          { path: "/dashboard", label: "Dashboard", icon: <FaChartLine /> },
          ...(isAdmin
            ? [
                {
                  path: "/admin/add-attendance",
                  label: "Mark Attendance",
                  icon: <FaCalendarCheck />,
                },
                {
                  path: "/admin/manage-students",
                  label: "Manage Students",
                  icon: <FaUsers />,
                },
                {
                  path: "/admin/manage-courses",
                  label: "Manage Courses",
                  icon: <FaBook />,
                },
              ]
            : [
                {
                  path: "/student/attendance",
                  label: "My Attendance",
                  icon: <FaCalendarCheck />,
                },
              ]),
          { path: "/profile", label: "Profile", icon: <FaUserCircle /> },
        ]),
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-primary-600 text-white rounded-lg shadow-lg hover:bg-primary-700 transition-all duration-200"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            />

            {/* Side Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-2xl z-40 md:hidden"
            >
              <div className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    AttendFlow
                  </h2>
                  {isAuthenticated && (
                    <p className="text-sm text-gray-600 mt-2">
                      Welcome, {user?.name}
                    </p>
                  )}
                </div>

                <nav className="space-y-2">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  {isAuthenticated && (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span>Logout</span>
                    </button>
                  )}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HamburgerMenu;
