const express = require('express');
const router = express.Router();
const pool = require('../db/config');

// GET public scenes with authors
router.get('/public-scenes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public_scenes_with_users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET user activity summary
router.get('/user-activity', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_activity_summary');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
