import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../style/Flashcards.css";
import BackButton from "../components/BackButton"; // Import BackButton

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [newFlashcard, setNewFlashcard] = useState({ question: "", answer: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;

  // Fetch flashcards for the logged-in user
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await api.get(`/flashcards/user/${userId}`);
        setFlashcards(response.data);
      } catch (err) {
        console.error("Error fetching flashcards:", err);
        setError("Failed to fetch flashcards.");
      }
    };
    fetchFlashcards();
  }, [userId]);

  // Handle creating a new flashcard
  const handleCreateFlashcard = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newFlashcard.question || !newFlashcard.answer) {
      setError("Both question and answer are required.");
      return;
    }

    try {
      const response = await api.post("/flashcards", {
        user_id: userId,
        question: newFlashcard.question,
        answer: newFlashcard.answer,
      });
      setFlashcards((prev) => [...prev, response.data]);
      setNewFlashcard({ question: "", answer: "" });
      setSuccess("Flashcard created successfully!");
    } catch (err) {
      console.error("Error creating flashcard:", err);
      setError("Failed to create flashcard.");
    }
  };

  return (
    <div className="groups-container">
      <BackButton /> {/* Add BackButton at the top */}

      <h2>Flashcards</h2>

      {/* New Flashcard Form */}
      <div className="create-group">
        <h3>Create New Flashcard</h3>
        <form onSubmit={handleCreateFlashcard}>
          <input
            type="text"
            placeholder="Enter question"
            value={newFlashcard.question}
            onChange={(e) =>
              setNewFlashcard((prev) => ({ ...prev, question: e.target.value }))
            }
            required
          />
          <input
            type="text"
            placeholder="Enter answer"
            value={newFlashcard.answer}
            onChange={(e) =>
              setNewFlashcard((prev) => ({ ...prev, answer: e.target.value }))
            }
            required
          />
          <button type="submit">Create Flashcard</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </div>

      {/* Flashcard List */}
      <div className="group-list">
        <h3>Your Flashcards</h3>
        {flashcards.length === 0 ? (
          <p>No flashcards found.</p>
        ) : (
          <ul>
            {flashcards.map((flashcard) => (
              <li key={flashcard.id} className="group-item">
                <strong>Q:</strong> {flashcard.question} <br />
                <strong>A:</strong> {flashcard.answer}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Flashcards;