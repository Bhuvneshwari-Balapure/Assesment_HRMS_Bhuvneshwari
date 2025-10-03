import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AddEmployeePage from "./pages/AddEmployeePage";
import ManageEmployeePage from "./pages/ManageEmployeePage";
import ApprovalPage from "./pages/ApprovalPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import EmployeeDashboardPage from "./pages/EmployeeDashboardPage";
import EmployeeRequestPage from "./pages/EmployeeRequestPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/add-employee"
              element={
                <ProtectedRoute allowedRoles={["HR"]}>
                  <AddEmployeePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-employee"
              element={
                <ProtectedRoute allowedRoles={["HR", "Employee"]}>
                  <ManageEmployeePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approval"
              element={
                <ProtectedRoute allowedRoles={["HR"]}>
                  <ApprovalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Employee"]}>
                  <EmployeeDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employee-request"
              element={
                <ProtectedRoute allowedRoles={["Employee"]}>
                  <EmployeeRequestPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
