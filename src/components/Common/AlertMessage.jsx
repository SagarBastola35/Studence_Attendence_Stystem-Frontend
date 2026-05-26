import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimesCircle,
  FaTimes,
} from "react-icons/fa";

const AlertMessage = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <FaCheckCircle className="text-green-500 text-xl" />,
    error: <FaTimesCircle className="text-red-500 text-xl" />,
    warning: <FaExclamationCircle className="text-yellow-500 text-xl" />,
    info: <FaInfoCircle className="text-blue-500 text-xl" />,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-20 right-4 z-50 flex items-center p-4 rounded-lg border shadow-lg ${colors[type]} max-w-md`}
      >
        <div className="flex items-center space-x-3">
          {icons[type]}
          <span className="text-sm font-medium">{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertMessage;
