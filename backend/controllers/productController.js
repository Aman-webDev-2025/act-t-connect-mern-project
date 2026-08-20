const Product = require("../models/Product");

// Create product
const createProduct = async (req, res) => {
    try {
        const { name, price, category, description } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({
                message: "Please fill all details",
            });
        }

        let image = "";
        if (req.file) {
            image = "/uploads/" + req.file.filename;
        }

        const product = await Product.create({
            name,
            price,
            category,
            description,
            image,
        });

        res.status(200).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

// Get all products (with search, filter, pagination, sorting)
const getProducts = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 5, sort = "desc" } = req.query;

        let query = {};

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        // Filter by category
        if (category && category !== "all") {
            query.category = category;
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limitNumber) || 1;

        const products = await Product.find(query)
            .sort({ createdAt: sort === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            products,
            totalProducts,
            totalPages,
            currentPage: pageNumber,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

// Get single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { name, price, category, description } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        if (name) product.name = name;
        if (price) product.price = price;
        if (category) product.category = category;
        if (description) product.description = description;

        if (req.file) {
            product.image = "/uploads/" + req.file.filename;
        }

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
