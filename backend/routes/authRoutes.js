const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  register,
  login,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Welcome!",
    user: req.user,
  });
});

module.exports = router;