import mongoose , {Document, model, Schema, Types} from "mongoose";
import { ref } from "node:process";
import { Interface } from "node:readline";

export interface IRestuarent extends Document{
    name:string , 
    slug : string,
    description: string ,
    cuisine:string , 
    priceRange : "$" | "$$" |"$$$"|"$$$$" ,
    rating:number,
    reviewCount:number,
    location:string ,
    address:string,
    image:string,
    chef:string ,
    tags:string[],
    availableSlots : string[],
    featured:boolean ,
    exclusive:boolean,
    owner:Types.ObjectId,
    totalseats:number,
    status:"pending"| "approved"| "rejected",
    createdAt : Date,
    UpdatedAt : Date


}

const RestuarentSchema = new Schema<IRestuarent>(
    {
        name : {type:String , required:true , trim : true},
        slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
        description: { type: String, required: true },
        cuisine: { type: String, required: true, trim: true },
        priceRange: { type: String, enum: ["$", "$$", "$$$", "$$$$"], required: true },
        rating: { type: Number, default: 5.0, min: 1, max: 5 },
        reviewCount: { type: Number, default: 0 },
        location: { type: String, required: true, trim: true },
        address: { type: String, required: true },
        image: { type: String, default: "" },
        chef: { type: String, required: true },
        tags: [{ type: String }],
        availableSlots: [{ type: String }],
        featured: { type: Boolean, default: false },
        exclusive: { type: Boolean, default: false },
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
        totalseats:{type:Number , default:20}
    },
    {timestamps:true}
 
)


export const Restuarent = model<IRestuarent>("Restuarent" , RestuarentSchema)