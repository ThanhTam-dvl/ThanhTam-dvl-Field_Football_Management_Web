// backend/routes/fieldRoutes.js
const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');

router.get('/', fieldController.getAllFields); // Trang chủ gọi API này
router.get('/available', fieldController.getAvailableFields); // Trang đặt sân dùng

module.exports = router;
