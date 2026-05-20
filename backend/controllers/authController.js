import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const adminRegister = async (req, res) => {
    console.log("REGISTER HIT");
    console.log(req.body);
    try{
        const { name, email, password} = req.body;

        const exitingUser = await User.findOne({ email});

        if(exitingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role: "admin",
        });

        res.status(201).json({
            message: "Admin registered",
            token: generateToken(user._id, user.role),
            user,
        });
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};


export const login = async(req, res) => {
    console.log("LOGIN HIT");
    console.log(req.body);
    try{

        const { email, password, role } = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        
        if (user.role !== role) {
            return res.status(400).json({
                message: "Invalid role selected",
            });
        }
        const isMatch = await bcrypt.compare(
            password,
            user.password,
        );

        if(!isMatch){
            return res.status(400).json({
                message: "Invalid Credentials",
            });
        }

        res.json({
            token: generateToken(user._id, user.role),

            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};