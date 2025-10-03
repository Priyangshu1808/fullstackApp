import { emailTemplate } from "../../emails/verification";
//import { resend } from "@/lib/resend";
import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    userName: string,
    otp: number
):Promise<apiResponse>{
    try {
      const { data, error } = await resend.emails.send({
      from: "chris<chris@update.chris-resend.com>",
      to: email,
      subject: 'mystery message',
      react: emailTemplate({ userName, otp }),
      
    });
    
        return {
            success: true,
            message: "Verification email sent successfully."
        }
        
    } catch (error) {
        console.error("error sending verification email: ",error)
        console.log("Error in Email: ",email)
        console.log("Your otp is: ",otp)
        return {
            success: false,
            message: "Failed to send verification email. Please try again later."
        }
    }
}

// import { apiResponse } from "@/types/apiResponse";
// import { info } from "console";
// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS,
   
//   },
// });
    


// export const sendVerificationEmail = async (email: string, userName: string, otp: number): Promise<apiResponse> => {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.GMAIL_USER, // sender address
//       to: email, // list of receivers
//       subject: "Verify your email", // Subject line
//       text: `Hello ${userName}, your OTP is ${otp}`, // plain text body
//       html: `<b>Hello ${userName}, your OTP is ${otp}</b>`, // html body
//     });

//     console.log("Message sent: %s", info.messageId);
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     return {
//             success: true,
//             message: "Verification email sent successfully."
//         }
//   } catch (err) {
//     console.error("Error while sending mail", err);

//     return {
//             success: false,
//             message: "Failed to send verification email. Please try again later."
//         }
//   }
// };

 