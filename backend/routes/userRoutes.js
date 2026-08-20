const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getProfile,
    updateProfile,
    changePassword,
} = require("../controllers/userController");

// --- User Profile Routes (Any Logged In User) ---
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

// --- Admin Only User Management Routes ---
router.post("/", protect, authorize("admin"), createUser);
router.get("/", protect, authorize("admin"), getUsers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;