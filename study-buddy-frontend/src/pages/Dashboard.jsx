
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>Welcome to StudyBuddy</h1>
      <div className="dashboard-buttons">
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
        <button onClick={() => navigate('/about')}>About</button>
      </div>
    </div>
  );
};

export default Dashboard;
