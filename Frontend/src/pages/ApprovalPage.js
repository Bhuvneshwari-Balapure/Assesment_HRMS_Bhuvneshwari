import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./css/ApprovalPage.css";

const ApprovalPage = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("Pending"); // Pending or Approved
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch approval requests from backend
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/approvals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      // fallback mock data
      setRequests([
        { id: 1, employee: "Alice", type: "Leave", status: "Pending" },
        { id: 2, employee: "Bob", type: "Leave", status: "Approved" },
        { id: 3, employee: "Charlie", type: "Overtime", status: "Pending" },
      ]);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleToggleStatus = async (request) => {
    try {
      const token = localStorage.getItem("authToken");
      const newStatus = request.status === "Pending" ? "Approved" : "Pending";

      // Update backend
      await axios.put(
        `${API_URL}/approvals/${request.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update frontend
      setRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      // Optional: local update fallback
      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id
            ? {
                ...r,
                status: request.status === "Pending" ? "Approved" : "Pending",
              }
            : r
        )
      );
    }
  };

  const filteredRequests =
    filter === "All" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="container">
      <Header />
      <main className="approval-main">
        <div className="approval-content">
          <h2>Approval Requests</h2>

          {/* Filter */}
          <div className="filter-container">
            <label>Filter by Status: </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          {/* Requests Table */}
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Employee</th>
                  <th>Request Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan="5">No requests found.</td>
                  </tr>
                )}
                {filteredRequests.map((req, idx) => (
                  <tr key={req.id}>
                    <td>{idx + 1}</td>
                    <td>{req.employee}</td>
                    <td>{req.type}</td>
                    <td>{req.status}</td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(req)}
                        className={
                          req.status === "Pending"
                            ? "approve-btn"
                            : "pending-btn"
                        }
                      >
                        {req.status === "Pending" ? "Approve" : "Set Pending"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApprovalPage;
