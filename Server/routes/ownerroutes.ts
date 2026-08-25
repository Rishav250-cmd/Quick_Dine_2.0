import { Router } from "express";
import { getownerRestuarent, updatebookingstatus, updateownerRestuarent } from "../controllers/ownercontroller.js";
import upload from "../config/multer.js";
import { owneronly, protect } from "../middlewares/auth.js";

const ownerrouter = Router();

ownerrouter.use(protect)
ownerrouter.use(owneronly)

ownerrouter.get("/restaurant", getownerRestuarent)
ownerrouter.post("/restaurant", upload.single("image"), getownerRestuarent)
ownerrouter.put("/restaurant", upload.single("image"), updateownerRestuarent)
ownerrouter.get("/bookings", getownerRestuarent)
ownerrouter.put("/bookings/:id/status", updatebookingstatus)
export default ownerrouter;