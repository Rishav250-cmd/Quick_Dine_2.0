import { Router } from "express";

import {
    getownerRestuarent,
    createownerRestuarent,
    updateownerRestuarent,
    getownerbooking,
    updatebookingstatus
} from "../controllers/ownercontroller.js";

import upload from "../config/multer.js";
import { owneronly, protect } from "../middlewares/auth.js";

const ownerrouter = Router();

ownerrouter.use(protect);
ownerrouter.use(owneronly);

// Restaurant
ownerrouter.get("/restaurant", getownerRestuarent);

ownerrouter.post(
    "/restaurant",
    upload.single("image"),
    createownerRestuarent
);

ownerrouter.put(
    "/restaurant",
    upload.single("image"),
    updateownerRestuarent
);

// Bookings
ownerrouter.get("/bookings", getownerbooking);

ownerrouter.put(
    "/bookings/:id/status",
    updatebookingstatus
);

export default ownerrouter;