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
} = require("../controllers/userController");


// Create User
router.post(
  "/",
  protect,
  authorize("admin"),
  createUser
);


// Get All Users
router.get(
  "/",
  protect,
  authorize("admin"),
  getUsers
);


// Get User By ID
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getUserById
);


// Update User
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateUser
);


// Delete User
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteUser
);


module.exports = router;