// backend/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.post('/', matchController.createMatch);
router.get('/', matchController.listMatches);
router.post('/join', matchController.joinMatch);
router.get('/:matchId/participants', matchController.listParticipants);

module.exports = router;
