import { Router } from "express";
import multer from "multer";

import {
    getownerRestuarent,
    createownerRestuarent,
    updateownerRestuarent,
    getownerbooking,
    updatebookingstatus,
} from "../controllers/ownercontroller.js";

import { protect, owneronly } from "../middlewares/auth.js";

const ownerrouter = Router();

// Multer configuration
const upload = multer({
    storage: multer.memoryStorage(),
});

// All owner routes require authentication
ownerrouter.use(protect);

// All owner routes require owner role
ownerrouter.use(owneronly);

// Restaurant routes
ownerrouter.get(
    "/restaurant",
    getownerRestuarent
);

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

// Booking routes
ownerrouter.get(
    "/bookings",
    getownerbooking
);

ownerrouter.put(
    "/bookings/:id/status",
    updatebookingstatus
);

export default ownerrouter;