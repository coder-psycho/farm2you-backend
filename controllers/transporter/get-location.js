const User = require("../../models/User");
var jwt = require("jsonwebtoken");
const asyncWrapper = require("../../middleware/async");




const addProduct = asyncWrapper(async (req, res) => {



    const username = req.body.username;

    let farmer = await User.findOne({username: username});
     if (!farmer) {
        return res.status(400).json({
            type:"error",
            message: "Farmer not found"
        })
     }

     console.log(`Get location: ${farmer.address}`)



    res.status(200).json({ type: "success", address: farmer.address });


});

module.exports = addProduct;