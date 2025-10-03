import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user";
import dbConnect from "@/lib/DBconnect";
import mongoose from "mongoose";



export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    // console.log("Session in get message:", session);
    const user = session?.user
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "You must be logged in to access the resource"
        }, { status: 401 })
    }
    //  console.log("user in get session:", user);
    
    const userId = new mongoose.Types.ObjectId(user?._id);
    //console.log("userId in get message:", userId);
    try {
        const userMessage = await UserModel.aggregate([
            {$match: {_id:userId}},
            {$unwind:"$messages"},
            {$sort:{"messages.createdAt":-1}},
            {$group:{_id:"$_id",message:{$push:"$messages"}}},
        ])
        //console.log("User Message in route:", userMessage);
        if (!userMessage) {
            return Response.json({
                success: false,
                message: "Failled to get user message"
            }, { status: 401 })

        }
        return Response.json({
            success: true,
            message: "Message fetched successfully",
            messages: userMessage.length > 0 ? userMessage[0].message : null
            //messages: userMessage[0].message
        }, { status: 200 })
        
    } catch (error) {
         console.log("Error in get message", error);
        return Response.json({
            success: false,
            message: "Error in get message"
        }, { status: 500 })
        
    }

}