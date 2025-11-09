const express = require('express');
const router = express.Router();
const saveLocation = require('../controllers/farmer/save-location');
const getLocation = require('../controllers/farmer/get-location');

router.route('/save-location').post(saveLocation)
router.route('/get-location').post(getLocation)

module.exports = router;