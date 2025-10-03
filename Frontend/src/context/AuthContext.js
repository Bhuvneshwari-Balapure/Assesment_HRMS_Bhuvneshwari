import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app start
    const checkAuthStatus = () => {
      const storedLoginState = localStorage.getItem('isLoggedIn');
      const storedRole = localStorage.getItem('role');
      const storedToken = localStorage.getItem('authToken');
      
      console.log('Auth Check:', { storedLoginState, storedRole, storedToken });
      
      if (storedLoginState === 'true' && storedRole && storedToken) {
        setIsLoggedIn(true);
        setRole(storedRole);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userRole) => {
    console.log('Logging in as:', userRole);
    
    // Set all required authentication data
    setIsLoggedIn(true);
    setRole(userRole);
    
    // Store in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', userRole);
    localStorage.setItem('authToken', 'dummy-token-' + Date.now()); // Temporary token
    localStorage.setItem('loginTime', new Date().toISOString());
    
    console.log('Login successful, localStorage set');
  };

  const logout = () => {
    console.log('Logging out');
    
    setIsLoggedIn(false);
    setRole(null);
    
    // Clear all authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('email');
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      role, 
      isLoading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};