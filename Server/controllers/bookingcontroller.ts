// create new booking 

import { Response } from "express";
import { Authrequest } from "../middlewares/auth.js";
import { Restuarent } from "../models/restuarent.js";
import { getrestuarentAvailability } from "./Restuarentcontroller.js";
import { Booking } from "../models/booking.js";
import { user } from "../models/users.js";
import { time } from "node:console";

//POST?API?BOOKING
//access private only 

export const createbooking = async (req: Authrequest, res: Response): Promise<void> => {
    try {
        const{restuarentId , date , time,guests ,occasion , specialRequests} = req.body;

        if(!restuarentId || !date || !time || !guests || !occasion || ! specialRequests){
            res.status(400).json({ message : "please provide information" });  
            return;         
        }
        const restuatent = await Restuarent.findById(restuarentId)
        if(!restuatent){
            res.status(404).json({ message : "restuarent not found" });  
            return;
        }
        if(restuatent.status !== "approved"){
            res.status(400).json({ message : "Restuarent is not open for reservation yet" });  
            return;
        }

        const requestedguest = Number(guests)

        const existingbooking = await Booking.find({
            restuarent : restuarentId,
            date : new Date(date),
            time  , 
            status:"confirmed"
        })
        const bookedSeats = existingbooking.reduce((sum, b) => sum + b.guests, 0)
        const totalseats = restuatent.totalseats || 20 ; 
        const availableseats = totalseats -bookedSeats ;  

        if(requestedguest>availableseats){
            res.status(400).json({
                message: `Unable to reserve. Only ${availableseats} seats are available for this time slot.`,
            })
        }
        const booking = await Booking.create({
            user: req.user?._id,
            restaurant: restuarentId,
            date: new Date(date),
            time,
            guests: requestedguest,
            status: "confirmed"
        })
        //populate restuarent info before returning 

        const populatebooking = await booking.populate("restuatent" , "name , location , image ,address");
        res.status(201).json(populatebooking);


    } catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : "Something went wrong";
        res.status(400).json({ message });
    }
}

export const getmybooking = async (req: Authrequest, res: Response): Promise<void> => {
    try {
        const booking = await Booking.find({User:req.user?._id}).populate("restuarent" , "name location image address slug").sort({Date:-1 , time:-1})
        res.json(booking);
    } catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : "Something went wrong";
        res.status(400).json({ message });
    }
}

export const cancelbooking = async (req: Authrequest, res: Response): Promise<void> => {
    try {
        const booking = await Booking.findById(req.params.id)
        if(!booking){
            res.status(404).json({message:"Booking not found"})
            return;
        }
        //verify the user has any booking 
        if (booking.user.toString() !== req.user?._id.toString()) {
        res.status(401).json({message: "Not authorized to cancel this booking"});
        return;
        }
        booking.status="cancelled";
        await booking.save();

        const populatedBooking = await booking.populate("restuarent" , "name location image address")
        res.json(populatedBooking);

    } catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : "Something went wrong";
        res.status(400).json({ message });
    }
}