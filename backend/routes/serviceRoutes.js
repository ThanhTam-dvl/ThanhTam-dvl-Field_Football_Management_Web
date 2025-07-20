// backend/routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.get('/', serviceController.getAllServices);
router.get('/:category', serviceController.getByCategory); // drink | food | equipment

module.exports = router;
