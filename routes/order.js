const express = require('express');
const router = express.Router();
const placeOrder = require('../controllers/order/place-order');

router.route('/place-order').post(placeOrder)

module.exports = router;