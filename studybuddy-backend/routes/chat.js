const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Send a message
router.post('/send', (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  if (!sender_id || !receiver_id || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
    [sender_id, receiver_id, message],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, sender_id, receiver_id, message });
    }
  );
});

// Get chat history between two users
router.get('/history/:user1_id/:user2_id', (req, res) => {
  const { user1_id, user2_id } = req.params;

  db.all(
    `SELECT * FROM messages 
     WHERE (sender_id = ? AND receiver_id = ?) 
        OR (sender_id = ? AND receiver_id = ?)
     ORDER BY timestamp`,
    [user1_id, user2_id, user2_id, user1_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

module.exports = router;