const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const register = async (req,res)=>{
    try{
        const {name, email, password} = req.body;
        console.log(req.body);
        const oldUser = await User.findOne({email});
        if(oldUser){
            return res.status(400).json({
                success:false,
                message:"User already exist"
            });
        }
        const hashPassword = await bcrypt.hash(password,10);
        const user = await User.create({name, email, password:hashPassword});
        res.status(201).json({
            success:true,
            message:"User Registered",
            user
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Unable to Register",
            error: err.message
        })
    }
};

const login = async (req,res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid Email"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid Password"
            });
        }
        const token = jwt.sign({
            id:user._id
        },process.env.SECRET_KEY,{expiresIn:"1d"})

        res.json({
            success:true,
            message:"Login Succes",
            token,
            data:user
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Unable to Login",
            error:err
        });
    }
};

const profile = (req,res) => {
    res.json({
        success:true,
        message:"Profile Fetched",
        user:req.user
    })
};

const logout = () =>{};

module.exports = {register, login, profile, logout};