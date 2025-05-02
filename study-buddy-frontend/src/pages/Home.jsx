import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/Home.css";

export default function Home({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome, {user.email},ID:{user.id}!</h1>
        <Link to="/groups">
          <button className="btn btn-primary">Groups</button>
        </Link>
        <Link to="/flashcards">
          <button className="btn btn-secondary">Flashcards</button>
        </Link>
        <button className="btn btn-logout" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}
