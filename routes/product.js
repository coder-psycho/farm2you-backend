const express = require('express');
const router = express.Router();
const addProduct = require('../controllers/product/add-product');

router.route('/add-product').post(addProduct)


module.exports = router;