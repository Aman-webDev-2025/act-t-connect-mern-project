const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async(req , res) =>{
    try{
        const {name , email , password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Please fill all details",
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: "User already exist",
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
        })

        res.status(200).json({
            message: "User registered Successfully",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
            }
        })
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            message:"Server error",
        })
    }
}

const login = async(req , res) =>{
    try{
        const {email , password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message : "please fill all details",
            })
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "invalid email",
            })
        }

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({
                message: "invalid password",
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {expiresIn: "7d"},
        )

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
            },
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            message:"Server error",
        })
    }
}

module.exports = {
    register, login,
}