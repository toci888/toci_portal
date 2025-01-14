const express = require('express');
const router = express.Router();

// Endpoint GET /api/scenes
router.get('/', (req, res) => {
  const db = req.app.get('db'); // Pobierz pulę połączeń z aplikacji
  db.query('SELECT * FROM scenes', (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.json(result.rows); // Zwróć wiersze z wyniku zapytania
  });
});

// Endpoint POST /api/scenes
router.post('/', (req, res) => {
  const db = req.app.get('db'); // Pobierz pulę połączeń z aplikacji
  const { title, description } = req.body;

  const query = 'INSERT INTO scenes (title, description) VALUES ($1, $2) RETURNING *';
  const values = [title, description];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).json(result.rows[0]); // Zwróć dodany wiersz
  });
});

module.exports = router;
