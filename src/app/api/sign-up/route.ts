import dbConnect from "@/lib/DBconnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    const { userName, email, password } = await request.json();
      if (!email) {
      return Response.json(
        {
          success: false,
          message: 'Email is required',
        },
        { status: 400 }
      );
    }
     if (!userName) {
      return Response.json(
        {
          success: false,
          message: 'Username is required',
        },
        { status: 400 }
      );
    }
  
    if (!password) {
      return Response.json(
        {
          success: false,
          message: 'Password is required',
        },
        { status: 400 }
      );
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes


    try {

        const existingUserbyUserName = await UserModel.findOne({ userName });
        const existingUserbyEmail = await UserModel.findOne({ email });

        if (existingUserbyUserName) {
            return Response.json({ success: false, message: "Username already taken" }, { status: 400 })

        }

        if (existingUserbyEmail) {
            if(existingUserbyEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email is already registered and Verified. Please log in."
                }, { status: 400 })
            }
            else{
                existingUserbyEmail.password = encryptedPassword;
                existingUserbyEmail.verifyCode = otp;
                existingUserbyEmail.verifyCodeExpiry = otpExpiry;
                await existingUserbyEmail.save();
            }
        }

        else {
            
            const newUser = new UserModel({
                userName,
                email,
                password: encryptedPassword,
                verifyCode: otp,
                isVerified: false,
                verifyCodeExpiry: otpExpiry,
                isAcceptMessages: false,
                messages: [],
            })
            await newUser.save();
        }
        console.log("OTP is:", otp);

        //  const emailResponse = await sendVerificationEmail(email, userName, otp);

        //     if (!emailResponse.success) {
        //         return Response.json({
        //             success: false,
        //             message: emailResponse.message
        //         }, { status: 400 })

        //     }
        //     console.log("Email Response:", emailResponse)
        
        return Response.json({
                    success: true,
                    message: "Email sent successfully. Please verify your email."
                }, { status: 200 })

    } catch (error) {
        console.error("Error in sign-up:", error);
        return Response.json({
            success: false,
            message: "Failed to sign up."
        }, { status: 500 })


    }
}


