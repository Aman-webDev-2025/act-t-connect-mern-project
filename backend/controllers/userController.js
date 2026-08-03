const User = require("../models/User");
const bcrypt = require("bcrypt");

//create user
const createUser = async(req , res)=>{
    try{
        const {name , email , password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message: "fill all required details",
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: "User already exists with this email",
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


//get all user
const getUsers = async(req , res)=>{
    try{
        const users = await User.find().select("-password");

        res.status(200).json({
            users,
        })
    }
    catch(error){
        res.status(500).json({
            message: "Server error",
        });
    }
}


//get user by id
const getUserById = async(req , res)=>{
    try{
        const user = await User.findById(req.params.id).select("-password");

        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
        user,
        });
    }
   catch(error){
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
}


//update user
const updateUser = async(req , res)=>{
    try{
        const {name , email , password , role} = req.body;

        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Update name
        if(name){
          user.name = name;
        }

        // Update email
        if(email){
          user.email = email;
        }

        // Update role
        if(role){
          user.role = role;
        }

        // Update password
        if(password){
          user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }    
        })
    }
    catch(error){
        res.status(500).json({
            message: "Server error",
        });
    }
}



//delete user
const deleteUser = async(req, res)=>{
  try{

    const user = await User.findById(req.params.id);

    if(!user){
        return res.status(404).json({
            message: "User not found",
        });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });

  } 
  catch(error){
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
};