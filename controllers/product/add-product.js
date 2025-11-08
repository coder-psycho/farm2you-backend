const User = require("../../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const asyncWrapper = require("../../middleware/async");
const connectDB = require("../../db/connect");
const Product = require("../../models/Product");



const addProduct = asyncWrapper(async (req, res) => {

    const productName = req.body.productName;
    const qty = req.body.qty;
    const price = req.body.price;
    const description = req.body.description;
    const images = req.body.images;
    console.log(productName, qty, price, description, images)


    if (!productName || !qty || !price || !description) {
        return res.status(400).json({
            type: "error",
            message: "All fields need to be filled"
        })
    }

    const token = req.headers.authorization?.split(' ')[1];
    const verification = jwt.verify(token, process.env.JWT_SECRET_KEY);

    let newProduct = new Product({
        user: verification.userId,
        productName,
        qty,
        price,
        description,
        images
    })
    await newProduct.save();

    return res.status(200).json({
        type: "success",
        message: "Product added successfully",
        product: newProduct._id
    })

});

module.exports = addProduct;