import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/ManageEmployeePage.css';

const ManageEmployeePage = ({ employees }) => {
    const [selectedDept, setSelectedDept] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // ek page par 3 employees

    // Dummy data for employees
    const dummyEmployees = [
        { sr: 1, name: 'Ashish Sharma', code: 'EMP001', dept: 'IT', proj: 'Project A' },
        { sr: 2, name: 'Priya Singh', code: 'EMP002', dept: 'HR', proj: 'Project B' },
        { sr: 3, name: 'Rahul Jain', code: 'EMP003', dept: 'IT', proj: 'Project C' },
        { sr: 4, name: 'Anjali Gupta', code: 'EMP004', dept: 'MK', proj: 'Project D' },
        { sr: 5, name: 'Vikram Yadav', code: 'EMP005', dept: 'HR', proj: 'Project A' },
    ];

    const filteredEmployees = selectedDept === 'All'
        ? dummyEmployees
        : dummyEmployees.filter(emp => emp.dept === selectedDept);

    const departments = ['All', ...new Set(dummyEmployees.map(emp => emp.dept))];

    // Pagination calculation
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

    // Placeholder functions for button actions
    const handleUpdate = (employeeCode) => {
        console.log(`Update action triggered for employee: ${employeeCode}`);
    };

    const handleDelete = (employeeCode) => {
        console.log(`Delete action triggered for employee: ${employeeCode}`);
    };

    // Dept change par hamesha first page se start ho
    const handleDeptChange = (e) => {
        setSelectedDept(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="container">
            <Header />
            <main className="manage-employee-main">
                <div className="manage-employee-box">
                    <h2>MANAGE EMPLOYEE</h2>

                    {/* Department Filter */}
                    <div className="filter-container">
                        <label htmlFor="dept-select">Select Dept.</label>
                        <select id="dept-select" value={selectedDept} onChange={handleDeptChange}>
                            {departments.map((dept, index) => (
                                <option key={index} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* Employee Table */}
                    <div className="employee-table-container">
                        <table className="employee-table">
                            <thead>
                                <tr>
                                    <th>Sr.</th>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Dept.</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedEmployees.map(emp => (
                                    <tr key={emp.code}>
                                        <td>{emp.sr}</td>
                                        <td>{emp.name}</td>
                                        <td>{emp.code}</td>
                                        <td>{emp.dept}</td>
                                        <td className="action-buttons">
                                            <button className="update-btn" onClick={() => handleUpdate(emp.code)}>✏️</button>
                                            <button className="delete-btn" onClick={() => handleDelete(emp.code)}>🗑️</button>
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
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            &lt;
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
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
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ManageEmployeePage;
