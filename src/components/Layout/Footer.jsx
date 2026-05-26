import React from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AttendFlow</h3>
            <p className="text-gray-400">
              Modern attendance management system for educational institutions.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-primary-400 transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-primary-400 transition"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-primary-400 transition"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">Real-time Tracking</li>
              <li className="text-gray-400">Analytics Dashboard</li>
              <li className="text-gray-400">Automated Reports</li>
              <li className="text-gray-400">Mobile Friendly</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition text-2xl"
              >
                <FaGithub />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition text-2xl"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition text-2xl"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            Made with <FaHeart className="inline text-red-500" /> for BCA Final
            Year Project
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © {new Date().getFullYear()} AttendFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
