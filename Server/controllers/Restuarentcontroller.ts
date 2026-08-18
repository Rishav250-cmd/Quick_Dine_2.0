import { Request, Response } from "express";
import { array } from "node:stream/iter";
import { Restuarent } from "../models/restuarent.js";
import jwt from "jsonwebtoken";       
import { user } from "../models/users.js";
import { Booking } from "../models/booking.js";

export const getrestuarent = async(req:Request , res : Response):Promise<void>=>{
    try {
        const{search , priceRange , rating , location , sort} = req.query;

        const queryOBJ:any = {status:"approved"}
        if(search){
            queryOBJ.$or=[
                {name:{$regex:search,$options:"i"}},
                {tags:{$regex:search,$options:"i"}},
                {location:{$regex:search,$options:"i"}}
            ]
        }
        if(priceRange){
            const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
            queryOBJ.priceRange = {$in:prices};
        }
        if(rating){
            queryOBJ.rating = {$gte:parseFloat(rating as string)};
        }
        if(location){
            queryOBJ.location = {$regex:location as string ,$options:"i"};
        }
        //sorting
        let sortoption : any= {createdAt:-1}
        if(sort==="rating"){
            sortoption = {rating:-1}
        }else if(sort === "price_low"){
            sortoption = { priceRange: 1}
        }else if(sort === "price_high"){
            sortoption = { priceRange: -1}
        }
        const restuarant = await Restuarent.find(queryOBJ).sort(sortoption)
        res.json(Restuarent)
        
    } catch (error : any) {
        console.log(error);
        res.status(400).json({message:error.message});
    }

}
export const getFeaturedrestuarent = async(req:Request , res : Response):Promise<void>=>{
    try {
        const featured = await Restuarent.find({
            status:"approved",
            $or:[{exclusive:true} , {featured:true}]
        }).limit(6);
        res.json(featured)
        
        
    } catch (error : any) {
        console.log(error);
        res.status(400).json({message:"server error"});
    }

}
export const getrestuarentbyslug = async(req:Request , res : Response):Promise<void>=>{
    try {
        const restuarant = await Restuarent.findOne({slug:req.params.slug});
        if(!restuarant){
            res.status(404).json({message:"Restuarant not found"});
            return;
        }
        //if not approved , verify authorization
        if(restuarant.status !== "approved"){
            let isAuthorized = false;
            if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
                try{
                    const token = req.headers.authorization.split(" ")[1];
                    const decoded = await jwt.verify(token , process.env.JWT_SECRET as string)as {id:string};
                    
                    const User = await user.findById(decoded.id);
                    if(user && (User?.role === "admin" )|| (User?.role==="owner" && restuarant.owner.toString()=== User._id.toString())){
                        isAuthorized = true;

                    }
                }
                catch(error){
                    console.log(error);
                    res.status(401).json({message:"Unauthorized"});
                    return;
                }
            }
            if(!isAuthorized){
                res.status(404).json({message:"Restuarent not find or pending approval"})
                return ;
            }
        }
        res.json(restuarant)
    } catch (error : any) {
        console.log(error);
        res.status(400).json({message:error.message});
    }

}
export const getrestuarentAvailability = async(req:Request , res : Response):Promise<void>=>{
    try {
        const {date} = req.query;
        if(!date){
            res.status(400).json({message:"please provide a date"})
            return;
        }
        const restuarent = await Restuarent.findById(req.params.id);
        if(!restuarent){
            res.status(400).json({message:"Restuarent not found"})
            return;
        }
        const bookingdate = new Date(date as string) 

        //get all the active booking on this date .
        const booking = await Booking.find({
            restaurant : restuarent._id,
            date : bookingdate ,
            status:"confirmed"

        })
        //map slot to availabale slot 
        const availability = restuarent.availableSlots.map((slot)=>{
            const bookedseat = booking.filter((b)=>b.time===slot).reduce((sum, b )=> sum+b.guests,0)
            const totalseats = restuarent.totalseats || 20 ;
            const availableseat = Math.max(0 , totalseats-bookedseat);
            return {
                time:slot , 
                availableseat , 
                isavailable : availableseat>0 
            }
        })
        res.json(availability)

    } catch (error : any) {
        console.log(error);
        res.status(400).json({message:error.message});
    }
}
