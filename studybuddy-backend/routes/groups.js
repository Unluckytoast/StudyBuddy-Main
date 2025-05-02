const express = require('express');
const router = express.Router();
const db = require('../db/database');

// CREATE GROUP AND ADD CREATOR AS MEMBER
router.post('/', (req, res) => {
  const { name, description, creator_id } = req.body;

  if (!name || !description || !creator_id) {
    return res.status(400).json({ error: 'Name, description, and creator_id are required' });
  }

  db.run(
    `INSERT INTO groups (name, description, creator_id) VALUES (?, ?, ?)`,
    [name, description, creator_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const groupId = this.lastID;

      // Automatically add the creator as a member of the group
      db.run(
        `INSERT INTO members (user_id, group_id) VALUES (?, ?)`,
        [creator_id, groupId],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });

          res.status(201).json({ id: groupId, name, description, creator_id });
        }
      );
    }
  );
});

// GET ALL GROUPS
router.get('/', (req, res) => {
  db.all(`SELECT * FROM groups`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET ALL GROUPS FOR A SPECIFIC USER
router.get('/user/:user_id', (req, res) => {
  const { user_id } = req.params;

  db.all(
    `SELECT g.* 
     FROM groups g
     INNER JOIN members m ON g.id = m.group_id
     WHERE m.user_id = ?`,
    [user_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// DELETE GROUP USING ID
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM groups WHERE id = ?`, req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// UPDATE GROUP USING ID
router.put('/:id', (req, res) => {
  const { name, description } = req.body;
  db.run(`UPDATE groups SET name = ?, description = ? WHERE id = ?`, [name, description, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

module.exports = router;
