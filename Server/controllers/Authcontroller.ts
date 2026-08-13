import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {  user } from "../models/users.js";
import bcrypt from "bcrypt"
import { Authrequest } from "../middlewares/auth.js";

const generatetoken  = (id:String)=> {
    return jwt .sign({id} , process.env.JWT_SECRET as string , {expiresIn : "30d"})
}

// register a new user 
export const registeruser = async (req: Request , res : Response): Promise<void> => {
    try {
        const {name , email , password , phone , role} = req.body;
        if(!name || !email || !password){
            res.status(400).json({message : "Please fill all the fields"})
            return; 
        }

        const userexist = await user.findOne({email})
        if(userexist){
            res.status(400).json({message : "User Already exist"})
            return;
        }
        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);
        const User = await user.create({
            name , email , password:hashedpassword , phone , role
        })
        if(User) {
            res.status(201).json({
                _id : User._id,
                name: User.name,
                email : User.email,
                phone : User.phone,
                role : User.role,
                token : generatetoken(User._id.toString())
            })
        } else{
            res.status(400).json({message : "Invalid Credentials"})
            return ;
        }
    } 
    catch (error : any ) {
            console.log(error);
            res.status(400).json({message:error.message});
        
        
    }
     
}

export const loginuser = async (req: Request , res : Response): Promise<void> => {
    try {
        const { email , password } = req.body;
        if( !email || !password){
            res.status(400).json({message : "Please enter the detail"})
            return; 
        }
        const User = await user.findOne({email})
        
        if(!User){
            res.status(401).json({message:"invalid email or password"});
            return ;
        }
        const ismatch = await bcrypt.compare(password, String(User.password) || "");
        if(!ismatch){
            res.status(401).json({message:"invalid password"})
            return ; 
        }
        res.json({
        _id : User._id,
        name: User.name,
        email : User.email,
        phone : User.phone,
        role : User.role,
        token : generatetoken(User._id.toString())
        })
        
    } catch (error:any) {
        console.log(error);
        res.status(400).json({message:error.message});
        
    }
     
}

export const getme = async (req: Authrequest & {user?: any} , res : Response): Promise<void> => {
    try {
        if(!req.user ){
            res.status(401).json({message : "User not authenticated"});
            return;
        }
        res.json(req.user);
        
    } catch (error: any) {
        console.log(error);
        res.status(400).json({message:error.message});
    }
     
}