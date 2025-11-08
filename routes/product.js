const express = require('express');
const router = express.Router();
const addProduct = require('../controllers/product/add-product');
const getProducts = require('../controllers/product/get-products');
const speechRecognition = require('../controllers/product/speech-recognition');
const textToFormatText = require('../controllers/product/text-to-format-text');

router.route('/add-product').post(addProduct)
router.route('/get-products').get(getProducts)
router.route('/speech-to-text').post(speechRecognition)

router.route('/text-to-format-text').post(textToFormatText)

module.exports = router;