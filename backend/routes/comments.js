const express = require('express');
const router = express.Router();
const pool = require('../db/config');

// GET all comments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comments');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET comment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CREATE comment
router.post('/', async (req, res) => {
  try {
    const { post_id, user_id, scene_id, content } = req.body;
    const result = await pool.query(
      'INSERT INTO comments (post_id, user_id, scene_id, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [post_id, user_id, scene_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE comment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const result = await pool.query(
      'UPDATE comments SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [content, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE comment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
