require("dotenv").config();

const express = require('express');
const cors = require('cors');
const DB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const userRoutes = require("./routes/userRoutes");

DB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/" , (req , res)=>{
    res.send("server is running");
})

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT , ()=> {
    console.log(`server is running on http://localhost:${PORT}`);
})