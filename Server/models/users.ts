import mongoose , {Document, model, Schema} from "mongoose";
import { ref } from "node:process";
import { Interface } from "node:readline";

export interface IUser extends Document{
    name:String , 
    email : String,
    password?: String ,
    phone?:String , 
    role : "user" | "admin" |"owner" ,
    createdAt : Date,
    UpdatedAt : Date 
}

const userSchema = new Schema<IUser>(
    {
        name : {type:String , required:true , trim : true},
        email : {type:String , required:true , unique:true , lowercase:true , trim : true},
        password : {type:String , minlength : 6 ,required:true},
        phone : {type:String , minlength : 6 ,required:true},
        role:{type:String , enum : ["user" , "admin" ,"owner"] , default:"user"},
    },
    {timestamps:true}
 
)
userSchema.set("toJSON" , {
    transform:(doc , ret)=>{
        delete ret.password ;
        return ret ;
    }
})

export const user = model<IUser>("user" , userSchema)