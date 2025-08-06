// routes/teamJoinRoutes.js
const express = require('express');
const router = express.Router();
const teamJoinController = require('../controllers/teamJoinController');

router.get('/', teamJoinController.listPosts);
router.post('/', teamJoinController.createPost);

module.exports = router;
