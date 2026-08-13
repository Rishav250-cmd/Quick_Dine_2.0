import { NextFunction, Request ,Response } from "express";
import { IUser, user } from "../models/users.js";
import jwt from "jsonwebtoken";

export interface Authrequest extends Request {
    user?: IUser
}
export const protect  = async(req:Authrequest , res:Response , next:NextFunction): Promise<void> =>{
    let token ; 
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];

            //verify token 

            const decoded = jwt.verify(token , process.env.JWT_SECRET!)as {id:string};

            //get user 
            const User = await user.findById(decoded.id).select("-password");
            if(!User){
                res.status(401).json({message: "user not authorized"});
                return ; 
            }
            req.user = User ;
            next();
            
        } catch (error) {
            res.status(401).json({message:"User authorization failed , try again"});
            
        }
        if(!token){
            res.status(401).json({message:"No token available"});
        }
    }

}

export const adminonly = (req:Authrequest , res:Response , next:NextFunction) => {
    if(req.user && req.user.role==="admin"){
        next();
    }
    else{
        res.status(401).json({message:"Not accessible , only admin id required"});
    }
}
export const owneronly = (req:Authrequest , res:Response , next:NextFunction) => {
    if(req.user && (req.user.role==="owner" || req.user.role==="admin" )){
        next();
    }
    else{
        res.status(401).json({message:"Not accessible , only admin id / owner id required"});
    }
}