import dbConnect from "@/lib/DBconnect";
import UserModel from "@/model/user";
import { z } from "zod";
import { userNameValidation } from "@/Schemas/signUpSchema";

const userNameQuerySchema = z.object({
    userName: userNameValidation

})
export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get('userName') || '';
    try {
        const parsed = userNameQuerySchema.safeParse({ userName });
        if (!parsed.success) {
            return Response.json({
                success: false,
                message: "Invalid username format"
            }, { status: 400 })
        }
        const existingUser = await UserModel.findOne({ userName, isVerified: true });
        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        } else {
            return Response.json({
                success: true,
                message: "Username is available"
            },{status: 200})
        }

    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json({
            success: false,
            message: "Internal server error while checking username uniqueness"
        }, { status: 400 })

    }
}