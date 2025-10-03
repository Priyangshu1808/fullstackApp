import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user";
import dbConnect from "@/lib/DBconnect";
import { log } from "console";
import { success } from "zod/v4";


export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user = session?.user
    // console.log("Session in accept message:", session);
    // console.log("user in session:", user);

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "You must be logged in to access the resource"
        }, { status: 401 })
    }
    const userId = user?._id
    // console.log("post accmess UserId:", userId)
    const { acceptMessage }: { acceptMessage: boolean } = await request.json();
    // console.log("AcceptMessage in route:", acceptMessage)
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptMessage: acceptMessage },
            { new: true }


        )

        // console.log("Updated User in accept message:", updatedUser);
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failled to update user  acceptance status"
            }, { status: 401 })

        }
        // await updatedUser.save()

        return Response.json({
            success: true,
            message: "Message preference updated successfully",
            updatedUser
        }, { status: 400 })

    } catch (error) {
        console.log("Error in accept message", error);
        return Response.json({
            success: false,
            message: "Error in accept message "
        }, { status: 500 })

    }

}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Getting user message acceptance status failed. You must be logged in to access the resource"
        }, { status: 401 })
    }
    const userId = user?._id
    // console.log("get accmess UserId:", userId)
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "User accept message status fetched successfully",

            isAcceptMessage: foundUser.isAcceptMessage,


        }, { status: 200 })


    } catch (error) {
        console.log("Error in fetching user", error);
        return Response.json({
            success: false,
            message: "Error in fetching user"
        }, { status: 500 })
    }
}
