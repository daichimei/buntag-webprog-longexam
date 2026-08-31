const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Admin only — full user management
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };

    exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, "-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };

    // Public — registration (defaults to "customer" unless an admin sets role)
    exports.createUser = async (req, res) => {
    try {
        if (!req.body.password) {
        return res.status(400).json({ message: "Password is required" });
        }

        // Only an authenticated admin can set role to supplier/admin
        const role =
        req.user && req.user.role === "admin" && req.body.role
            ? req.body.role
            : "customer";

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({ ...req.body, password: hashedPassword, role });
        const savedUser = await newUser.save();

        const { password, ...userWithoutPassword } = savedUser.toObject();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    };

    exports.updateUser = async (req, res) => {
    try {
        // Only admins may change role
        if (req.body.role && (!req.user || req.user.role !== "admin")) {
        delete req.body.role;
        }
        if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        fields: "-password",
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    };

    exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };

    exports.loginUser = async (req, res) => {
    try {
        console.log("LOGIN BODY RECEIVED:", req.body);
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.isActive) {
        return res.status(403).json({ message: "Your account is inactive. Please contact support." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            id: user._id,
            role: user.role,
            name: user.name,
            profilePicture: user.profilePicture || null,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};