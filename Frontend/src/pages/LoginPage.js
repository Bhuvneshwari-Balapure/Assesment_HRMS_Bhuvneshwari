import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ Axios import karein
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/LoginPage.css';

const LoginPage = () => {
    const [loginAs, setLoginAs] = useState(''); // ✅ State define karein
    const [loginId, setLoginId] = useState(''); // ✅ State define karein
    const [password, setPassword] = useState(''); // ✅ State define karein
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // ✅ Navigate define karein
    const { login } = useAuth(); // ✅ Login function define karein

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!loginAs || !loginId.trim() || !password.trim()) {
            alert('Please fill in all the required fields.');
            return;
        }

        try {
            // BACKEND LOGIN API CALL
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email: loginId,
                password: password,
            });

            if (response.data.success) {
                const user = response.data.user;
                const token = response.data.token;
                
                // Backend se mila token use karein
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('role', user.role);
                localStorage.setItem('email', user.email);
                localStorage.setItem('authToken', token); // REAL TOKEN
                
                login(user.role);
                alert('Login Successful! (Database)');
                
                if (user.role === 'HR') {
                    navigate('/add-employee');
                } else {
                    navigate('/manage-employee');
                }
            }
        } catch (error) {
            console.error("Login Error:", error);
            
            // Fallback: Frontend login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('role', loginAs);
            localStorage.setItem('email', loginId);
            localStorage.setItem('authToken', 'fallback-token-' + Date.now());
            
            login(loginAs);
            alert('Login Successful! (Local Mode)');
            
            if (loginAs === 'HR') {
                navigate('/add-employee');
            } else {
                navigate('/manage-employee');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container login-page-container"> 
            <Header />
            <main className="login-main">
                <div className="login-box">
                    <h2>LOGIN</h2>
                    <p style={{textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '15px'}}>
                        Use any credentials to login
                    </p>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="login-as">Login As</label>
                            <select
                                id="login-as"
                                value={loginAs}
                                onChange={(e) => setLoginAs(e.target.value)}
                                required
                            >
                                <option value="">-- Select Role --</option>
                                <option value="HR">HR</option>
                                <option value="Employee">Employee</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="login-id">Login ID (Email)</label>
                            <input
                                type="email"
                                id="login-id"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                required
                                placeholder="Enter any email"
                            />
                        </div>
                        <div className="form-group password-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter any password"
                                />
                                <span 
                                    className="password-toggle-icon" 
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <button type="submit" className="login-btn">
                            Login
                        </button>
                    </form>
                    <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;