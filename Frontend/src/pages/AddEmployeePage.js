import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./css/AddEmployeePage.css";

const departmentProjects = {
  IT: ["Website Revamp", "Backend API", "Server Migration"],
  HR: ["Recruitment Drive", "Payroll System", "Employee Training"],
  MK: ["Social Media Campaign", "Branding", "Market Research"],
};

// Password generator
const generatePassword = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let pass = "";
  for (let i = 0; i < 8; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
};

const AddEmployeePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    doj: "",
    dept: "",
    proj: "",
    email: "",
    password: "",
  });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (formData.dept) {
      setProjects(departmentProjects[formData.dept]);
    } else {
      setProjects([]);
    }
    setFormData((prev) => ({ ...prev, proj: "" }));
  }, [formData.dept]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Environment variable
  const API_URL = process.env.REACT_APP_API_URL;

  // Authentication check
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated || userRole !== "HR") {
    setTimeout(() => {
      alert("Please login as HR to access this page.");
      navigate("/login");
    }, 100);
    return null;
  }

  // Update project dropdown when dept changes
  // useEffect(() => {
  //   setProjects(formData.dept ? departmentProjects[formData.dept] : []);
  //   setFormData((prev) => ({ ...prev, proj: "" }));
  // }, [formData.dept]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Generate Employee Code
  const generateEmpCode = (employees) => {
    const numbers = employees
      .map((emp) => parseInt(emp.code.replace("EMP", ""), 10))
      .sort((a, b) => a - b);

    let codeNumber = 1;
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] !== codeNumber) {
        break;
      }
      codeNumber++;
    }

    return `EMP${String(codeNumber).padStart(3, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.doj ||
      !formData.dept ||
      !formData.proj ||
      !formData.email
    ) {
      alert("Please fill in all fields including Email");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      // GET all employees to generate code
      const res = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const employees = res.data || [];
      const newCode = generateEmpCode(employees);
      const password = generatePassword();

      const newEmployee = { ...formData, code: newCode, password };

      // POST new employee
      const response = await axios.post(`${API_URL}/employees`, newEmployee, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (response.data.success) {
        alert(
          `Employee added successfully!\nCode: ${newCode}\nPassword: ${password}`
        );
        setFormData({
          name: "",
          code: "",
          doj: "",
          dept: "",
          proj: "",
          email: "",
          password: "",
        });
        navigate("/manage-employee");
      } else {
        throw new Error("Backend response not successful");
      }
    } catch (error) {
      console.error("Backend Error:", error);

      // LocalStorage fallback
      alert("Backend unavailable. Saving locally...");
      const employees = JSON.parse(localStorage.getItem("employees") || "[]");
      const newCode = generateEmpCode(employees);
      const password = generatePassword();

      const newEmployee = {
        sr: employees.length + 1,
        name: formData.name,
        code: newCode,
        dept: formData.dept,
        proj: formData.proj,
        doj: formData.doj,
        email: formData.email,
        password,
        addedDate: new Date().toISOString(),
        addedBy: "HR",
      };

      employees.push(newEmployee);
      localStorage.setItem("employees", JSON.stringify(employees));

      alert(`Employee saved locally!\nCode: ${newCode}\nPassword: ${password}`);
      setFormData({
        name: "",
        code: "",
        doj: "",
        dept: "",
        proj: "",
        email: "",
        password: "",
      });
      navigate("/manage-employee");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      <main className="add-employee-main">
        <div className="add-employee-box">
          <h2>ADD EMPLOYEE</h2>
          <form className="add-employee-form" onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="form-group">
              <label htmlFor="emp-name">Emp Name *</label>
              <input
                type="text"
                id="emp-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter employee name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emp-id">Emp ID/Code *</label>
              <input
                type="text"
                id="emp-id"
                name="code"
                value={formData.code}
                readOnly
                placeholder="Auto-generated"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Set Password *</label>
              <input
                type="text"
                id="password"
                name="password"
                value={formData.password}
                readOnly
                placeholder="Auto-generated"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="doj">Date of Joining *</label>
              <input
                type="date"
                id="doj"
                name="doj"
                value={formData.doj}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dept">Department *</label>
              <select
                id="dept"
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {Object.keys(departmentProjects).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="proj">Project *</label>
              <select
                id="proj"
                name="proj"
                value={formData.proj}
                onChange={handleChange}
                required
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="add-emp-btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "ADD EMP"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddEmployeePage;
