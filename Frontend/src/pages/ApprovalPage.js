import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/ApprovalPage.css'; // You can create a new CSS file for this page

const ApprovalPage = () => {
  return (
    <div className="container">
      <Header />
      <main className="approval-main">
        <div className="approval-content">
          <h2>Approval Requests</h2>
          <p>This is the page where HR can view and manage employee leave or other approval requests.</p>
          {/* You can add your approval request list or table here */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApprovalPage;