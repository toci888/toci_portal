const express = require('express');
const router = express.Router();
const pool = require('../db/config');

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    //console.log('registration',  req.body);

    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1 and password_hash = $2', [email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send('nie udało sie'); //err.message
  }
});

// CREATE user
router.post('/', async (req, res) => {
  try {
    console.log('registration',  req.body);

    const { username, email, password } = req.body;
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send('nie udało sie'); //err.message
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password_hash } = req.body;
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, password_hash = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [username, email, password_hash, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
