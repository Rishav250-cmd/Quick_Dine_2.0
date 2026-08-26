import { Router } from "express";
import { adminonly, protect } from "../middlewares/auth.js";
import { apporverestuarent, getadminstats, getallrestaurent } from "../controllers/admincontroller.js";

const adminrouter = Router();
adminrouter.use(protect)
adminrouter.use(adminonly)

adminrouter.get("/restaurants", getallrestaurent);
adminrouter.put("/restaurants/:id/approve", apporverestuarent);
adminrouter.get("/stats", getadminstats);

export default adminrouter;