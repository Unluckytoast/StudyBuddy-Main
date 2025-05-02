import React, { useState } from 'react';
import axios from 'axios';
import "../style/LoginForm.css";
import BackButtonToDashboard from './BackButtonToDashboard'; // Import BackButtonToDashboard

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/auth/login',
        { email, password }
      );
      console.log('Login response:', data);

      const { token } = data;
      if (!token) throw new Error('Invalid response structure');

      let user;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = { id: payload.id, email: payload.email };
      } catch {
        throw new Error('Failed to decode token');
      }

      onLoginSuccess({ token, user });
    } catch (err) {
      console.error('Login error:', err);
      setError(
        'Login failed: ' +
          (err.response?.data?.error || err.message || 'Unknown error')
      );
    }
  };

  return (
    <div>
      <BackButtonToDashboard /> {/* Add Back Button */}
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
