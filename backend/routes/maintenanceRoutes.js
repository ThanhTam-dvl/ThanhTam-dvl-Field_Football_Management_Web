// backend/routes/maintenanceRoutes.js
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

router.post('/', maintenanceController.createSchedule);
router.get('/', maintenanceController.getAll);
router.get('/field/:fieldId', maintenanceController.getByField);

module.exports = router;
