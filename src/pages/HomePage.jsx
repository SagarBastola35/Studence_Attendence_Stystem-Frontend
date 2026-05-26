import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaShieldAlt,
  FaMobileAlt,
  FaClock,
  FaUsers,
  FaRobot,
} from "react-icons/fa";

const HomePage = () => {
  const features = [
    {
      icon: <FaChartLine />,
      title: "Real-time Analytics",
      description:
        "Track attendance patterns with interactive charts and detailed reports",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Authentication",
      description: "Role-based access control with JWT authentication",
    },
    {
      icon: <FaMobileAlt />,
      title: "Mobile Responsive",
      description: "Access from any device with responsive design",
    },
    {
      icon: <FaClock />,
      title: "Bulk Marking",
      description: "Mark attendance for multiple students at once",
    },
    {
      icon: <FaUsers />,
      title: "Multi-role Support",
      description: "Separate dashboards for admin and students",
    },
    {
      icon: <FaRobot />,
      title: "Smart Reports",
      description: "Generate automated attendance reports",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Attendance Management System
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Streamline attendance tracking with modern technology
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage attendance efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-primary-600 text-4xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-primary-200">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-200">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-primary-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
