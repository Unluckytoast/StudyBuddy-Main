import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/BackButton.css';

const BackButtonToDashboard = () => {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate('/dashboard')}>
      Back to Dashboard
    </button>
  );
};

export default BackButtonToDashboard;