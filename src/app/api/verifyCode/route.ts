import dbConnect from "@/lib/DBconnect";
import UserModel from "@/model/user";

export async function POST(request: Request) {
    await dbConnect();
   try {
     const { userName, otp } = await request.json()
     const decodeUserName = decodeURIComponent(userName)
     const user = await UserModel.findOne({ userName: decodeUserName || userName })
     //console.log("User found:", user);
     if (!user) {
         console.log("user Not found");
         return Response.json({
             success: false,
             message: "User not found"
         }, { status: 400 })
     }

     if(user.isVerified){
        return Response.json({
             success: false,
             message: "User already verified"
         }, { status: 400 })
     }

     const validExpairyDate = new Date(user.verifyCodeExpiry) > new Date()
     const validOTP = otp == user.verifyCode
 
     if (validExpairyDate && validOTP) {
         user.isVerified = true
         await user.save()
         console.log("User verified successfully");
         return Response.json({
             success: true,
             message: "User verified successfully"
         }, { status: 200 })
     
     }
 
     else if(!validExpairyDate) {
         console.log("OTP expired");
         return Response.json({
             success: false,
             message: "OTP expired. Please sign in again"
         }, { status: 400 })
 
     }
     else {
         console.log("Invalid otp");
         return Response.json({
             success: false,
             message: "Invalid otp. Please enter currect otp"
         }, { status: 400 })
     }
   } catch (error) {
    console.error("Error in code verification: ",error);
    return Response.json({
             success: false,
             message: "Error in code verification. Please try again."
         }, { status: 400 })
    
   }

}


