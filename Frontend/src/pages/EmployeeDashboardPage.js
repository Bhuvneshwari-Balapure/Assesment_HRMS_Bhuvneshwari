import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./css/EmployeeDashboardPage.css";

const EmployeeDashboardPage = () => {
  const [employee, setEmployee] = useState({});
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("authToken");

        // Fetch employee info
        const resEmp = await axios.get(
          `${process.env.REACT_APP_API_URL}/employees/${email}`, // ✅ plural employees
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmployee(resEmp.data);

        // Fetch employee requests (if you have requests API)
        const resReq = await axios.get(
          `${process.env.REACT_APP_API_URL}/employees/requests/${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(resReq.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Disapproved":
        return "red";
      default:
        return "orange";
    }
  };

  return (
    <div className="container">
      <Header />
      <main className="employee-dashboard-main">
        <h2>My Dashboard</h2>

        <div className="employee-info">
          <h3>Employee Info</h3>
          <p>
            <strong>Name:</strong> {employee.name}
          </p>
          <p>
            <strong>Code:</strong> {employee.code}
          </p>
          <p>
            <strong>Department:</strong> {employee.dept}
          </p>
          <p>
            <strong>Project:</strong> {employee.proj}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
        </div>

        <div className="employee-requests">
          <h3>My Requests</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Reason / Details</th>
                <th>Dates / Project</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req, idx) => (
                  <tr key={idx}>
                    <td>{req.requestType}</td>
                    <td>{req.details}</td>
                    <td>
                      {req.requestType === "Leave"
                        ? `${req.startDate?.split("T")[0]} to ${
                            req.endDate?.split("T")[0]
                          }`
                        : req.project || "-"}
                    </td>
                    <td style={{ color: getStatusColor(req.status) }}>
                      {req.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmployeeDashboardPage;
