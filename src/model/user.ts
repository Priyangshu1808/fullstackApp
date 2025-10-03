import { Schema, Document } from "mongoose";
import mongoose from "mongoose";


export interface message extends Document {
    content : string;
    createdAt : Date;
}

export const messageSchema : Schema<message> = new Schema({
    content : {
        type : String, 
        required : true
    },
    createdAt : {
        type : Date, 
        required : true,
        default : Date.now
    }
});

export interface User extends Document {
    userName: string;
    email: string;
    password: string;
    verifyCode : number;
    isVerified : boolean;
    verifyCodeExpiry : Date;
    isAcceptMessage : boolean;
    messages : message[];
}

const userSchema : Schema<User> = new Schema({
    userName: {
        type: String,
        required: [ true, "Username is required" ],
        unique: true,
    },
    email: {
        type: String,
        required: [ true, "Email is required" ],
        unique: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address" ],
    },
    password: {
        type: String,
        required: [ true, "Password is required" ],
    },
    verifyCode : {
        type : Number,
        required : true
    },
    isVerified : {
        type : Boolean,
        required : true,
        default : false
    },
    verifyCodeExpiry : {
        type : Date,
        required : true
    },
    isAcceptMessage : {
        type : Boolean,
        default : true
    },
    messages : [messageSchema]
});






//const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema);
const UserModel = (mongoose.models?.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default UserModel;