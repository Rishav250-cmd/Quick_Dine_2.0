import { Request, Response } from "express";

export const getrestuarent = async(req:Request , res : Response):Promise<void>=>{
    try {
        const{search , priceRange , rating , location , sort} = req.query;

        const queryOBJ:any = {status:"approved"}
        if(search){
            queryOBJ.$or=[
                {name:{$regex:search,$options:"i"}}
            ]
        }

        
    } catch (error : any) {
        console.log(error);
        res.status(400).json({message:error.message});
    }

}

export const getFeaturedrestuarent = async(req:Request , res : Response):Promise<void>=>{
    try {
        
        
    } catch (error : any) {
        console.log(error);
        res.status(400).json({message:error.message});
    }

}

export const getrestuarentbyslug = async(req:Request , res : Response):Promise<void>=>{
    try {
        
        
    } catch (error : any) {
        console.log(error);
        res.status(400).json({message:error.message});
    }

}
export const getrestuarentAvailability = async(req:Request , res : Response):Promise<void>=>{
    try {
        
        
    } catch (error : any) {
        console.log(error);
        res.status(400).json({message:error.message});
    }

}