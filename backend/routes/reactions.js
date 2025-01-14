const express = require('express');
const router = express.Router();
const pool = require('../db/config');

// GET all reactions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reactions');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET reaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM reactions WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE reaction
router.post('/', async (req, res) => {
  try {
    const { user_id, post_id, comment_id, reaction_type } = req.body;
    const result = await pool.query(
      'INSERT INTO reactions (user_id, post_id, comment_id, reaction_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, post_id, comment_id, reaction_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE reaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reaction_type } = req.body;
    const result = await pool.query(
      'UPDATE reactions SET reaction_type = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [reaction_type, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE reaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM reactions WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
