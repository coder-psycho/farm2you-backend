const User = require("../../models/User");
const asyncWrapper = require("../../middleware/async");
const Product = require("../../models/Product");



const getProducts = asyncWrapper(async (req, res) => {
    let products = await Product.find({}).populate("user");

    return res.status(200).json({
        type: "success",
        products: products
    })

});

module.exports = getProducts;