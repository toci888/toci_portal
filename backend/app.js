const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const usersRoutes = require('./routes/users');
const scenesRoutes = require('./routes/scenes');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const reactionsRoutes = require('./routes/reactions');
const viewsRoutes = require('./routes/views');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/scenes', scenesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/views', viewsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
