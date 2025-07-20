// backend/routes/fieldRoutes.js
const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');

router.get('/', fieldController.getAllFields);

module.exports = router;
