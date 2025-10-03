import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./css/ManageEmployeePage.css";

const ManageEmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL; // ✅ Use env variable

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const departments = ["All", ...new Set(employees.map((emp) => emp.dept))];

  const filteredEmployees =
    selectedDept === "All"
      ? employees
      : employees.filter((emp) => emp.dept === selectedDept);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDeptChange = (e) => {
    setSelectedDept(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setShowEditModal(true);
  };

  const handleDelete = (emp) => {
    setEditingEmployee(emp);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/employees/${editingEmployee._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee({ ...editingEmployee, [name]: value });
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/employees/${editingEmployee._id}`,
        editingEmployee,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchEmployees();
      setShowEditModal(false);
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  const getFirstName = (fullName) => fullName.split(" ")[0];

  return (
    <div className="container">
      <Header />
      <main className="manage-employee-main">
        <div className="manage-employee-box">
          <h2>MANAGE EMPLOYEE</h2>

          {/* Department Filter */}
          <div className="filter-container">
            <label htmlFor="dept-select">Select Dept.</label>
            <select
              id="dept-select"
              value={selectedDept}
              onChange={handleDeptChange}
            >
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Table */}
          <div className="employee-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>First Name</th>
                  <th>Code</th>
                  <th>Dept.</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp, index) => (
                  <tr key={emp._id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{getFirstName(emp.name)}</td>
                    <td>{emp.code}</td>
                    <td>{emp.dept}</td>
                    <td className="action-buttons">
                      <button
                        className="update-btn"
                        onClick={() => handleEdit(emp)}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(emp)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={currentPage === num ? "active" : ""}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
        {/* Edit Modal */}
        {showEditModal && editingEmployee && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Employee</h3>
              <form className="edit-form">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingEmployee.name}
                  onChange={handleEditChange}
                />

                <label>Code</label>
                <input
                  type="text"
                  name="code"
                  value={editingEmployee.code}
                  disabled
                />

                <label>Department</label>
                <input
                  type="text"
                  name="dept"
                  value={editingEmployee.dept}
                  onChange={handleEditChange}
                />

                <label>Project</label>
                <input
                  type="text"
                  name="proj"
                  value={editingEmployee.proj}
                  onChange={handleEditChange}
                />

                <label>Date of Joining</label>
                <input
                  type="date"
                  name="doj"
                  value={editingEmployee.doj?.split("T")[0] || ""}
                  onChange={handleEditChange}
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingEmployee.email}
                  onChange={handleEditChange}
                />

                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={editingEmployee.password || ""}
                  onChange={handleEditChange}
                />

                <label>Added Date</label>
                <input
                  type="text"
                  name="addedDate"
                  value={new Date(
                    editingEmployee.addedDate
                  ).toLocaleDateString()}
                  disabled
                />

                <label>Added By</label>
                <input
                  type="text"
                  name="addedBy"
                  value={editingEmployee.addedBy}
                  disabled
                />

                <div className="modal-actions">
                  <button type="button" onClick={saveEdit} className="save-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && editingEmployee && (
          <div className="modal">
            <div className="modal-content">
              <h3>Confirm Delete</h3>
              <p>
                Are you sure you want to delete{" "}
                {getFirstName(editingEmployee.name)}?
              </p>
              <button onClick={confirmDelete}>Yes, Delete</button>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ManageEmployeePage;
