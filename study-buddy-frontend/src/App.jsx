import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Groups from './pages/Groups';
import About from './pages/About';
import Home from './pages/Home';
import Flashcards from './pages/Flashcards'; // Import Flashcards component

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, email: payload.email });
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLoginSuccess = ({ token, user }) => {
    localStorage.setItem('token', token);
    setUser(user);
    navigate('/home', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/groups" element={user ? <Groups /> : <Navigate to="/" />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/register" element={<RegisterForm onRegisterSuccess={handleLoginSuccess} />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/home"
        element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
      />
      <Route
        path="/flashcards"
        element={user ? <Flashcards /> : <Navigate to="/login" />} // Add Flashcards route
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

