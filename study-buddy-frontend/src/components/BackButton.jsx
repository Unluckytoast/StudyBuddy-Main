import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate('/home')}>
      Back to Home
    </button>
  );
};

export default BackButton;