import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// register user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check existing user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Respond
        res.status(201).json({
            message: "Register Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            token: generateToken(user._id, res),
        });

    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ error: "Email and Password Required" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ error: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Email or Password" });
        }

        res.json({
            message: "Login Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            token: generateToken(user._id, res),
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// logout
// Optional (only useful if you use cookies)
export const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.json({ message: "Logged out successfully" });
};
//get all profiles

export const getAllProfile = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });

    } catch (error) {
        console.error("Get Profile Error:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
};

/// Profile update
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("+password");

        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }

        const body = req.body || {};

        user.name = body.name ?? user.name;
        user.email = body.email ?? user.email;

        if (body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(body.password, salt);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile Updated",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            }
        });

    } catch (error) {
        console.error("Update Profile Error:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
};
