const express = require('express');
const router = express.Router();
const { getAllScenes, createScene, updateScene, deleteScene } = require('../controllers/sceneController');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, getAllScenes);
router.post('/', authenticate, createScene);
router.put('/:id', authenticate, updateScene);
router.delete('/:id', authenticate, deleteScene);

module.exports = router;
