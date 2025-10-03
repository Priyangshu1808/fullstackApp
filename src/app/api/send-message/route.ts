import dbConnect from "@/lib/DBconnect";
import UserModel, { message } from "@/model/user";


export async function POST(request: Request) {
    await dbConnect();
    const { userName, content } = await request.json();
    //const decodeUserName = decodeURIComponent(userName)
    //console.log("content:",content);
    //console.log("Username:",userName);
    try {
        const user = await UserModel.findOne({ userName });
        if (!user) {
            console.log("user Not found");
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
        }
        if (!content || content.trim() === "") {
            return Response.json({
                success: false,
                message: "Message content is required"
            }, { status: 400 });
        }
        if(!user.isAcceptMessage) {
             return Response.json({
                success: false,
                message: "User not accept message"
            }, { status: 400 });
        }
        const newMessage = { content, createdAt: new Date() }
        // console.log("New message:", newMessage);
        // console.log("Existing messages:", user.messages);
        user.messages.push(newMessage as message);
        

        await user.save();
        //console.log("User after saving message:", user);
        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 })
    } catch (error) {
        console.log("Error in sending message", error);
        return Response.json({
            success: false,
            message: "Error in sending message"
        }, { status: 500 })
    }

}