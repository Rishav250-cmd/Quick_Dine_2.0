import { Response } from "express";
import { Authrequest } from "../middlewares/auth.js";
import { Restuarent } from "../models/restuarent.js";
import cloudinary from "../config/cloudinary.js";
import { Booking } from "../models/booking.js";
import { time } from "node:console";
import { stat } from "node:fs";

//helper function to upload buffer to cloudinary 
const uploadToCloudinary = (fileBuffer: Buffer): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "QuickDine" }, (error, result) => {
      if (error) return reject(error);
      if (!result) return reject(new Error("Upload failed"));
      resolve({ secure_url: result.secure_url });
    });
    stream.end(fileBuffer);
  });
};


// get owner restuarent 

export const getownerRestuarent = async(req:Authrequest , res:Response):Promise<void>=>{
    try {
        const restuarent = await Restuarent.findOne({owner:req.user?._id})
        if(!restuarent){
            res.status(404).json(null)
            return ;
        }
        res.json(restuarent);
        
    } catch (error:any) {
        console.log(error)
        res.status(400).json({message:error.message})
    }
}
export const createownerRestuarent = async(req:Authrequest , res:Response):Promise<void>=>{
    try {
        const existing = await Restuarent.findOne({owner:req.user?._id})
        if(existing){
            res.status(400).json({message:"you already have a existing restuarent"})
            return ; 
        }
        const { name, description, cuisine, priceRange, location, address, chef, tags, availableSlots, totalseats } = req.body;

        if (!name || !description || !cuisine || !priceRange || !location || !address || !chef) {
            res.status(400).json({ message: "Please provide all required fields" });
            return;
        }
        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        const slugExists = await Restuarent.findOne({ slug });
        if (slugExists) {
            res.status(400).json({ message: "A restaurant with this name already exists" });
            return;
        }

        // Handle image

        let imageurl = "";
        if(req.file){
            const result = await uploadToCloudinary(req.file.buffer);
            imageurl=result.secure_url
            //handle image upload
        }
        //setup parsed tags and slot 
        const parsedTags = typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags || [];
        const parseedslot  = typeof availableSlots==="string" ? availableSlots.split(",").map((s)=>s.trim()):availableSlots || ["18:00","19:00","20:00","21:00","22:00",]
        const restuarent = await Restuarent.create({
            name ,slug , description , cuisine ,  priceRange , location, address ,chef, image : imageurl , tags:parsedTags , availableSlots : parseedslot , totalseats : totalseats? Number(totalseats):20,owner:req.user?._id , status :"pending"
        })
        res.status(201).json(restuarent);
    } catch (error:any) {
        console.log(error)
        res.status(400).json({message:error.message})
    }

}
export const updateownerRestuarent = async(req:Authrequest , res:Response):Promise<void>=>{
    try {
        const restuarant = await Restuarent.findOne({owner : req.user?._id})
        if(!restuarant){
            res.status(404).json({message:"restuarent not found"});
            return;
        }
        const { name, description, cuisine, priceRange, location, address, chef, tags, availableSlots, totalseats } = req.body;
        if (name) restuarant.name = name;
        if (description) restuarant.description = description;
        if (cuisine) restuarant.cuisine = cuisine;
        if (priceRange) restuarant.priceRange = priceRange;
        if (location) restuarant.location = location;
        if (address) restuarant.address = address;
        if (chef) restuarant.chef = chef;
        if (totalseats) restuarant.totalseats = Number(totalseats);

        if (tags) {
        restuarant.tags = typeof tags === "string" 
            ? tags.split(",").map((t) => t.trim()) 
            : tags;
        };
        if (availableSlots) restuarant.availableSlots = typeof availableSlots === "string" ? availableSlots.split(",").map((s) => s.trim()) : availableSlots;
        //handle new image uploading 
        
        if(req.file){
            const result = await uploadToCloudinary(req.file.buffer);
            restuarant.image=result.secure_url
            //handle image upload
        }
        const updated = await restuarant.save();
        res.json(updated)

    } catch (error:any) {
        console.log(error)
        res.status(400).json({message:error.message})
    }

}
export const getownerbooking = async(req:Authrequest , res:Response):Promise<void>=>{
    try {
        const restuarant = await Restuarent.findOne({owner : req.user?._id})
        if(!restuarant){
            res.status(404).json({message:"restuarent not found"});
            return;
        }
        const booking  = await Booking.find({restaurant:restuarant._id}).populate("user" , "name email phone").sort({date:-1 , time:-1})
        res.json(booking)
    } catch (error:any) {
        console.log(error)
        res.status(400).json({message:error.message})
    }

}
export const updatebookingstatus = async(req:Authrequest , res:Response):Promise<void>=>{
    try {
        const {status} = req.body;
        if(!status || !["confirmed", "cancelled", "completed"].includes(status)){
            res.status(400).json({message:"please enter a valid booking status"})
            return ;
        }
        const booking = await Booking.findById(req.params.id)
        if(!booking){
            res.status(400).json({message:"booking not found"})
            return ;
        }
        const restuarent= await Restuarent.findById(booking.restaurant)
        if (!restuarent || restuarent.owner.toString() !== req.user?._id.toString()) {
            res.status(401).json({message:"Not authorized to edit this booking"})
        }
        booking.status=status ;
        await booking.save();
        res.json(booking)

    } catch (error:any) {
        console.log(error)
        res.status(400).json({message:error.message})
    }

}
