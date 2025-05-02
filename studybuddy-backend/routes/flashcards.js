const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Create a flashcard
router.post('/', (req, res) => {
  const { user_id, question, answer } = req.body;

  if (!user_id || !question || !answer) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    `INSERT INTO flashcards (user_id, question, answer) VALUES (?, ?, ?)`,
    [user_id, question, answer],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, user_id, question, answer });
    }
  );
});

// Get all flashcards for a user
router.get('/user/:user_id', (req, res) => {
  const { user_id } = req.params;

  db.all(`SELECT * FROM flashcards WHERE user_id = ?`, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update a flashcard
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: 'Both question and answer are required' });
  }

  db.run(
    `UPDATE flashcards SET question = ?, answer = ? WHERE id = ?`,
    [question, answer, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Flashcard not found' });
      res.json({ id, question, answer });
    }
  );
});

// Delete a flashcard
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM flashcards WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Flashcard not found' });
    res.status(204).send();
  });
});

module.exports = router;