const express = require('express');
const router = express.Router();
const placeOrder = require('../controllers/order/place-order');
const getOrders = require('../controllers/order/get-orders');
const getTransporterOrders = require('../controllers/order/get-transporter-orders');
const getFarmerOrders = require('../controllers/order/get-farmer-orders');

router.route('/place-order').post(placeOrder)
router.route('/get-orders').post(getOrders)
router.route('/get-transporter-orders').post(getTransporterOrders)
router.route('/get-farmer-orders').post(getFarmerOrders)

module.exports = router;