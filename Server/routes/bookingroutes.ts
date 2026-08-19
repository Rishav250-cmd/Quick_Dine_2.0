import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { cancelbooking, createbooking, getmybooking } from "../controllers/bookingcontroller.js";

const bookingrouter = Router();

bookingrouter.post('/' , protect ,createbooking)
bookingrouter.get('/my' , protect ,getmybooking)
bookingrouter.put('/:id/cancel' , protect ,cancelbooking)

export default bookingrouter ;

