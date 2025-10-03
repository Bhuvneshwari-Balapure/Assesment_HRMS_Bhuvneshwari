import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./css/ApprovalPage.css";

const ApprovalPage = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("Pending");
  // const API_URL = process.env.REACT_APP_API_URL;

  // Fetch all approval requests (HR only)
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("API URL:", process.env.REACT_APP_API_URL);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/empReq/approvals`
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Function to approve request (HR only)
  const handleToggleStatus = async (request) => {
    try {
      // const token = localStorage.getItem("authToken");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/employees/approvals/${request._id}`,
        { status: "Approved" }
      );

      setRequests((prev) =>
        prev.map((r) =>
          r._id === request._id ? { ...r, status: "Approved" } : r
        )
      );
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  // Function to get color for status
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Rejected":
        return "red";
      case "Pending":
      default:
        return "orange";
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
                  <th>Details</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="9">No requests found.</td>
                  </tr>
                ) : (
                  filteredRequests.map((req, idx) => (
                    <tr key={req._id}>
                      <td>{idx + 1}</td>
                      <td>{req.employeeName}</td>
                      <td>{req.requestType}</td>
                      <td>{req.details}</td>
                      <td>
                        {req.startDate ? req.startDate.split("T")[0] : "-"}
                      </td>
                      <td>{req.endDate ? req.endDate.split("T")[0] : "-"}</td>
                      <td>{req.project || "-"}</td>
                      <td style={{ color: getStatusColor(req.status) }}>
                        {req.status}
                      </td>
                      <td>
                        {req.status === "Pending" && (
                          <button
                            onClick={() => handleToggleStatus(req)}
                            className="approve-btn"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
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
