const express = require('express');
const router = express.Router();
const saveLocation = require('../controllers/farmer/save-location');

router.route('/save-location').post(saveLocation)

module.exports = router;