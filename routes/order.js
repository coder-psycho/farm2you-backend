const express = require('express');
const router = express.Router();
const placeOrder = require('../controllers/order/place-order');
const getOrders = require('../controllers/order/get-orders');

router.route('/place-order').post(placeOrder)
router.route('/get-orders').post(getOrders)

module.exports = router;