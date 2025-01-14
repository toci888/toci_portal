const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const sceneRoutes = require('./routes/scenes');

const db = require('./db/config.js');
console.log('config', db);

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/scenes', sceneRoutes);

// Database setup
//const db = config.pool;

// Sprawdzenie połączenia
db.connect()
  .then(() => console.log('Connected to PostgreSQL!'))
  .catch(err => console.error('Error connecting to PostgreSQL:', err));

// Udostępnianie puli połączeń w aplikacji
app.set('db', db);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
