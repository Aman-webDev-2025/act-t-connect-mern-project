require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const DB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

DB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.send("server is running");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});