import React from 'react';
import './css/Header.css';

const Header = () => {
    return (
        <div className="header">
            <div className="logo-placeholder">
                <img src="/images/company_logo3.jpg" alt="Company Logo" />
            </div>
            <div className="header-text">
                <h1>OPTICO SOLUTIONS</h1>
                <p>HRMS [Employee Management]</p>
            </div>
        </div>
    );
};

export default Header;