import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaSignInAlt,
  FaSignOutAlt,
  FaTasks,
  FaClipboardCheck,
} from "react-icons/fa";
import "./css/Footer.css";

const Footer = () => {
  const { isLoggedIn, logout, role } = useAuth();
  const location = useLocation();

  const isCurrentPath = (path) => location.pathname === path;

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    window.location.href = "/";
  };

  return (
    <footer className="footer">
      <nav className="footer-nav">
        <NavLink to="/">
          <FaHome className="footer-icon" />
          <span className="footer-text">Home</span>
        </NavLink>

        {isLoggedIn && role === "HR" && (
          <>
            <NavLink
              to="/add-employee"
              className={isCurrentPath("/add-employee") ? "active" : ""}
            >
              <FaUsers className="footer-icon" />
              <span className="footer-text">Add Emp</span>
            </NavLink>

            <NavLink
              to="/manage-employee"
              className={isCurrentPath("/manage-employee") ? "active" : ""}
            >
              <FaTasks className="footer-icon" />
              <span className="footer-text">Manage</span>
            </NavLink>

            <NavLink
              to="/approval"
              className={isCurrentPath("/approval") ? "active" : ""}
            >
              <FaClipboardCheck className="footer-icon" />
              <span className="footer-text">Approval</span>
            </NavLink>

            <a href="#" onClick={handleLogout}>
              <FaSignOutAlt className="footer-icon" />
              <span className="footer-text">Logout</span>
            </a>
          </>
        )}

        {isLoggedIn && role === "Employee" && (
          <>
            <NavLink
              to="/employee-dashboard"
              className={isCurrentPath("/employee-dashboard") ? "active" : ""}
            >
              <FaUsers className="footer-icon" />
              <span className="footer-text">Dashboard</span>
            </NavLink>

            <NavLink
              to="/employee-request"
              className={isCurrentPath("/employee-request") ? "active" : ""}
            >
              <FaUserTie className="footer-icon" />
              <span className="footer-text">Request</span>
            </NavLink>

            <a href="#" onClick={handleLogout}>
              <FaSignOutAlt className="footer-icon" />
              <span className="footer-text">Logout</span>
            </a>
          </>
        )}

        {!isLoggedIn && (
          <>
            <NavLink to="/login">
              <FaSignInAlt className="footer-icon" />
              <span className="footer-text">Login</span>
            </NavLink>
          </>
        )}
      </nav>
    </footer>
  );
};

export default Footer;
