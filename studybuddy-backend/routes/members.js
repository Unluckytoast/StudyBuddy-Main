const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET ALL MEMBERS
router.get('/', (req, res) => {
  db.all('SELECT * FROM members', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET SINGLE MEMBER BY ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM members WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(row);
  });
});

// ADD NEW MEMBER
router.post('/', (req, res) => {
  const { user_id, group_id } = req.body;
  if (!user_id || !group_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  db.run(
    'INSERT INTO members (user_id, group_id) VALUES (?, ?)',
    [user_id, group_id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// UPDATE MEMBER BY ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { user_id, group_id } = req.body;
  db.run(
    'UPDATE members SET user_id = ?, group_id = ? WHERE id = ?',
    [user_id, group_id, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Member not found' });
      }
      res.json({ updated: this.changes });
    }
  );
});

// DELETE MEMBER BY ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM members WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ deleted: this.changes });
  });
});

module.exports = router;