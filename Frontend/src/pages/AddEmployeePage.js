import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/AddEmployeePage.css';

const AddEmployeePage = () => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        doj: '',
        dept: '',
        proj: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Authentication check
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('role');

    if (!isAuthenticated || userRole !== 'HR') {
        setTimeout(() => {
            alert("Please login as HR to access this page.");
            navigate('/login');
        }, 100);
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (localStorage.getItem('isLoggedIn') !== 'true' || localStorage.getItem('role') !== 'HR') {
            alert("Session expired. Please login again.");
            navigate('/login');
            return;
        }

        if (!formData.name || !formData.code || !formData.doj || !formData.dept || !formData.proj) {
            alert('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            
            // ✅ CORRECT BACKEND URL (Port 8000)
            const response = await axios.post('http://127.0.0.1:8000/api/employees', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type':'application/json'
                },
                timeout: 10000 // 10 second timeout
            });

            if (response.data.success) {
                alert('Employee added to MySQL database successfully!');
                setFormData({ name: '', code: '', doj: '', dept: '', proj: '' });
                navigate('/manage-employee');
            } else {
                throw new Error('Backend response not successful');
            }

        } catch (error) {
            console.error('Backend Error:', error);
            
            // Fallback to localStorage
            alert('Backend unavailable. Saving locally...');
            
            const employees = JSON.parse(localStorage.getItem('employees') || '[]');
            const nextSr = employees.length > 0 ? Math.max(...employees.map(emp => emp.sr || 0)) + 1 : 1;
            
            const newEmployee = {
                sr: nextSr,
                name: formData.name,
                code: formData.code,
                dept: formData.dept,
                proj: formData.proj,
                doj: formData.doj,
                addedDate: new Date().toISOString(),
                addedBy: 'HR'
            };
            
            employees.push(newEmployee);
            localStorage.setItem('employees', JSON.stringify(employees));
            
            alert('Employee saved locally!');
            setFormData({ name: '', code: '', doj: '', dept: '', proj: '' });
            navigate('/manage-employee');
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
                    <p style={{textAlign: 'center', color: '#666', fontSize: '12px'}}>
                    </p>
                    <form className="add-employee-form" onSubmit={handleSubmit}>
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
                                onChange={handleChange} 
                                required 
                                placeholder="Enter employee code"
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
                            <input 
                                type="text" 
                                id="dept" 
                                name="dept" 
                                value={formData.dept} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter department"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="proj">Project *</label>
                            <input 
                                type="text" 
                                id="proj" 
                                name="proj" 
                                value={formData.proj} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter project name"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="add-emp-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving to Database...' : 'ADD EMP'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AddEmployeePage;