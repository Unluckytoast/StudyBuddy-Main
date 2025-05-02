import React from 'react';
import BackButtonToDashboard from '../components/BackButtonToDashboard'; // Import BackButtonToDashboard

const About = () => {
  return (
    <div>
      <BackButtonToDashboard /> {/* Add Back Button */}
      <h2>About This App</h2>
      <p>This is a study and group management tool.</p>
    </div>
  );
};

export default About;
