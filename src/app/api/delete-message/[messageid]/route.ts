import { getServerSession } from "next-auth";
import UserModel from "@/model/user";
import dbConnect from "@/lib/DBconnect";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";



export async function DELETE(request: Request,{ params}: {params: {messageid: string}}) {
    await dbConnect();
     const messageId = params.messageid; 
    
    //console.log("Message ID to delete:", messageId);
    
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
    // console.log("userId in get message:", userId);
    try {
        const updateResult = UserModel.updateOne(
            //{_id: user._id},
            {_id: userId},
            {$pull: {messages: {_id: new mongoose.Types.ObjectId(messageId)}}}
            //{$pull: {messages: {_id: messageId}}}
        )
        //console.log("Update Result in delete message:", updateResult);
         if ((await updateResult).modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Failed to delete user message"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "Message deleted successfully",
        }, { status: 200 })
       
    } catch (error) {
         console.log("Error in delete message", error);
        return Response.json({
            success: false,
            message: "Error in delete message"
        }, { status: 500 })
        
    }

}