const express = require('express');
const router = express.Router();
const pool = require('../db/config');

// GET public_scenes_with_users
router.get('/public_scenes_with_users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public_scenes_with_users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET scenes_with_action_tag
router.get('/scenes_with_action_tag', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scenes_with_action_tag');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET scenes_with_reactions
router.get('/scenes_with_reactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scenes_with_reactions');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET users_with_public_scenes
router.get('/users_with_public_scenes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users_with_public_scenes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET comments_with_authors_and_scenes
router.get('/comments_with_authors_and_scenes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comments_with_authors_and_scenes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET scene_reactions_with_authors
router.get('/scene_reactions_with_authors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scene_reactions_with_authors');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET user_activity_summary
router.get('/user_activity_summary', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_activity_summary');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
