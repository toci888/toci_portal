const express = require('express');
const router = express.Router();
const pool = require('../db/config');

// GET all scenes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scenes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET scene by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM scenes WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE scene
router.post('/', async (req, res) => {
  try {
    const { title, description, user_id, tags } = req.body;
    const result = await pool.query(
      'INSERT INTO scenes (title, description, user_id, tags) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, user_id, tags]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE scene
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    const result = await pool.query(
      'UPDATE scenes SET title = $1, description = $2, tags = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [title, description, tags, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE scene
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM scenes WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
