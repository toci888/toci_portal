const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/users');
const sceneRoutes = require('./routes/scenes');
const chatRoutes = require('./routes/chat');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/scenes', sceneRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
