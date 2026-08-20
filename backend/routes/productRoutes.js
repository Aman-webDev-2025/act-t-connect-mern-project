const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

// Routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, upload.single("image"), createProduct);
router.put("/:id", protect, upload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
