const express = require('express');
const router = express.Router();
const incidentCtrl = require('../controllers/incidentController');

router.get('/', incidentCtrl.getIncidents);
router.post('/', incidentCtrl.createIncident);

module.exports = router;
