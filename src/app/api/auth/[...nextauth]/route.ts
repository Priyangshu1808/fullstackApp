import NextAuth from "next-auth";
import { authOptions } from "./options";
import { getServerSession } from "next-auth/next"
import type { NextApiRequest, NextApiResponse } from "next";
const handler = NextAuth(authOptions);




// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const session = await getServerSession(req, res, authOptions)

//   if (session) {
//     res.send({
//       content:
//         "This is protected content. You can access this content because you are signed in.",
//     })
//   } else {
//     res.send({
//       error: "You must be signed in to view the protected content on this page.",
//     })
//   }
// }

export { handler as GET, handler as POST };