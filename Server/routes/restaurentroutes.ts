import { Router } from "express";
import { getFeaturedrestuarent, getrestuarent, getrestuarentAvailability, getrestuarentbyslug } from "../controllers/Restuarentcontroller.js";

const restuarentRoutes = Router();

restuarentRoutes.get('/' , getrestuarent)
restuarentRoutes.get('/featured' , getFeaturedrestuarent)
restuarentRoutes.get('/:slug' , getrestuarentbyslug)
restuarentRoutes.get('/:id/availability' , getrestuarentAvailability);

export default restuarentRoutes ; 