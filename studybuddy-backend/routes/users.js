const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authenticateToken = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
router.use(authenticateToken);

// CREATE NEW USER
router.post('/', (req, res) => {
  const { name, email } = req.body;
  db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, email });
  });
});

// GET ALL USERS
router.get('/', (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET USER BY ID 
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  db.get(`SELECT id, name, email, password FROM users WHERE id = ?`, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json(row);
  });
});

// UPDATE USER USING ID
router.put('/:id', async (req, res) => {
  const { name, email, password } = req.body;

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  db.run(
    `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`,
    [name, email, hashedPassword, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE USERS USING ID
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM users WHERE id = ?`, req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
