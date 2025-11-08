const User = require("../../models/User");
var jwt = require("jsonwebtoken");
const asyncWrapper = require("../../middleware/async");




const addProduct = asyncWrapper(async (req, res) => {

    const fullAddress = req.body.address;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
  
    console.log(fullAddress, latitude, longitude)



    const token = req.body.token;
    const verification = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const updateResult = await User.updateOne(
      { _id: verification.userId },
      {
        $set: {
          address: {
            latitude: latitude,
            longitude: longitude,
            fullAddress: fullAddress,
          },
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully" });

    return res.status(200).json({
        type: "success",
        message: "Product added successfully",
        product: newProduct._id
    })

});

module.exports = addProduct;