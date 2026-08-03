const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

router.get(
  "/dashboard",
  protect,
  authorize("admin", "user"),
  (req, res) => {
    res.json({
      message: "Welcome User",
    });
  }
);

module.exports = router;