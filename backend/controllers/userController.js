const User = require("../models/User");
const bcrypt = require("bcrypt");

// CREATE User (Admin)
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Fill all required details",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
        });

        res.status(200).json({
            message: "User registered Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

// GET All Users (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            users,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

// GET User by ID (Admin)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

// UPDATE User (Admin)
const updateUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

// DELETE User (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        await user.deleteOne();

        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

// GET Profile (Current Logged In User)
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

// UPDATE Profile (Current Logged In User)
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    message: "Email is already taken by another user",
                });
            }
            user.email = email;
        }

        if (name) {
            user.name = name;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

// CHANGE Password (Current Logged In User)
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Please fill both current and new password",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters long",
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getProfile,
    updateProfile,
    changePassword,
};