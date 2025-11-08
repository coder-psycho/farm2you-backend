const bcrypt = require("bcryptjs");
const asyncWrapper = require("../../middleware/async");

const User = require("../../models/User");



const signup = asyncWrapper(async (req, res) => {

    const { role, username, password } = req.body;
    console.log(username, role, password);

    if (!role || !username || !password) {
        return res.status(400).json({ type: "error", message: "Username, role and password are required." });
    }



    const existingUser = await User.findOne({
        $or: [{ username }]
    });

    if (existingUser) {
        return res.status(400).json({
            type: "error",
            message: "Username already taken."
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {


        const user = new User({
            role,
            password: hashedPassword,
            username
        });

        await user.save();

        return res.status(200).json({ type: "success", message: "User registered successfully." });


    } catch (error) {

        console.error("Error during signup:", error);
        return res.status(500).json({ type: "error", message: "Server error. Please try again later." });
    }
});

module.exports = signup;