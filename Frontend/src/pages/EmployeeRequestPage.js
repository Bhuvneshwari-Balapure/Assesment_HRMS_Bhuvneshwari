import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./css/EmployeeRequestPage.css";

const EmployeeRequestPage = () => {
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState("");

  useEffect(() => {
    // fetch projects if backend has API
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/projects`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("authToken");

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/employee/request`,
        { email, type, reason, startDate, endDate, project },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Request submitted successfully!");
      setType("");
      setReason("");
      setStartDate("");
      setEndDate("");
      setProject("");
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container">
      <Header />
      <main className="employee-request-main">
        <h2>Raise a Request</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Request Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              <option value="Leave">Leave</option>
              <option value="Project Change">Project Change</option>
            </select>
          </div>

          {type === "Leave" && (
            <>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {type === "Project Change" && (
            <div>
              <label>Select Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                required
              >
                <option value="">-- Select Project --</option>
                {projects.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label>Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit">Submit Request</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default EmployeeRequestPage;
