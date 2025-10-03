import dbConnect from "@/lib/DBconnect";
import UserModel from "@/model/user";
//import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { email } = await request.json();
        const decodedEmail = decodeURIComponent(email);
        const user = await UserModel.findOne({ email: decodedEmail || email })
        if (!user) {
            console.log("user Not found");
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 })

        }
        const userName = user.userName
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
        user.verifyCode = otp;
        user.verifyCodeExpiry = otpExpiry;
        await user.save();

        // const emailResponse = await sendVerificationEmail(email, userName, otp);
        // if (!emailResponse.success) {
        //     return Response.json({
        //         success: false,
        //         message: emailResponse.message
        //     }, { status: 400 })

       // }
       //console.log(`Verification code sent to ${email}: ${otp}`); // For testing purposes only. Remove in production.
        return Response.json({
            success: true,
            message: "Verification code sent successfully"
        }, { status: 200 })
        

    } catch (error) {
        console.error("Error while sending Verification code again");
        return Response.json({
            success: false,
            message: "Error while sending Verification code again. Please try again."
        }, { status: 400 })

    }


}