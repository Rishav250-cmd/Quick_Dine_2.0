import { Router } from "express";
import { getme, loginuser, registeruser } from "../controllers/Authcontroller.js";
import { protect } from "../middlewares/auth.js";


const authRouter = Router();

authRouter.post("/Register"  , registeruser);
authRouter.post("/login"  , loginuser)
authRouter.get("/me"  , protect, getme)

export default authRouter ; 