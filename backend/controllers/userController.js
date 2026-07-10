const User = require("../models/adminModel");
const jwt = require('jsonwebtoken')

exports.registerAuthor = async (req, res) => {
    console.log("Inside Register Author");

    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const newAuthor = new User({
            username,
            email,
            password,
            role: "author"
        });

        await newAuthor.save();

        res.status(201).json({
            success: true,
            message: "Author registered successfully",
            author: newAuthor
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};


exports.login = async (req, res) => {
    console.log("Inside Login");

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
{
    userId: user._id,
    userName: user.username,
    userMail: user.email,
    role: user.role
},
            process.env.jwtKey
        );
        console.log("Token :",token);
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};