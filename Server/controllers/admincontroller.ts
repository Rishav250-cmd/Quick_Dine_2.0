import { Response } from "express";
import { Authrequest } from "../middlewares/auth.js";
import { Restuarent } from "../models/restuarent.js";
import { user } from "../models/users.js";
import { Booking } from "../models/booking.js";

//get all restuarent for admin management
//get/api/admin/restuarent 



export const getallrestaurent = async (req:Authrequest , res : Response):Promise<void> => {
    try {
        const restuarent =await Restuarent.find({}).populate("owner" , "name email phone").sort({createdAt:-1})
        res.json(restuarent)
    } catch (error:any) {
        console.log(error)
        res.status(400).json({message:error.message})
        
    }
}
export const apporverestuarent = async (req:Authrequest , res : Response):Promise<void> => {
    try {
        const status = req.body;
        if(!status || !["approved" , "rejected" , "pending"].includes(status)){
            res.status(400).json({message:"please provide the valid approval status"})
            return ;
        }       
        const restuarent = await Restuarent.findById(req.params.id) ;
        if(!restuarent){
            res.status(404).json({message:"restuarent not found"});
            return ;
        }
        restuarent.status = status;
        await restuarent.save();
        res.json(restuarent);
    } catch (error:any) {
        console.log(error)
        res.status(400).json({message:error.message})
        
    }
}
export const getadminstats = async (req:Authrequest , res : Response):Promise<void> => {
    try {
        const totaluser  =await user.countDocuments({role:"user"})
        const totalowner  =await user.countDocuments({role:"owner"})
        const totalbooking = await Booking.countDocuments({})
        const totalRestuarent = await Restuarent.countDocuments({})
        const latestbooking = await Booking.find({}).populate("user" , "name email").populate("restaurent" ,"name").sort({createdAt:-1}).limit(10)
        
        res.json({
            user:{
                totaluser ,
                totalowner,
                total : totalowner+totaluser
            },
            restuarent :{
                totalRestuarent
            },
            booking:{
                totalbooking
            },
            latestbooking
        })
    } catch (error:any) {
        console.log(error)
        res.status(400).json({message:error.message})
        
    }
}