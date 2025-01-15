const db = require('../db');

exports.getAllScenes = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM scenes WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching scenes' });
  }
};

exports.createScene = async (req, res) => {
  const { title, description } = req.body;
  try {
    const query = 'INSERT INTO scenes (title, description, user_id) VALUES ($1, $2, $3)';
    await db.query(query, [title, description, req.user.id]);
    res.status(201).json({ message: 'Scene created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error creating scene' });
  }
};

exports.updateScene = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const query = 'UPDATE scenes SET title = $1, description = $2 WHERE id = $3 AND user_id = $4';
    await db.query(query, [title, description, id, req.user.id]);
    res.json({ message: 'Scene updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating scene' });
  }
};

exports.deleteScene = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM scenes WHERE id = $1 AND user_id = $2';
    await db.query(query, [id, req.user.id]);
    res.json({ message: 'Scene deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting scene' });
  }
};
