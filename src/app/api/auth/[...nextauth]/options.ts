import dbConnect from "@/lib/DBconnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect()
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials?.email }, { userName: credentials?.username }]
          })
          //console.log("User in authorize is:", user)
          if (!user) {
            throw new Error("No user found with the given email or username")
          }
          const isPasswordValid = await bcrypt.compare(credentials?.password, user.password)
          //console.log("isPasswordValid:", isPasswordValid)
          if (!isPasswordValid) {
            throw new Error("Invalid password")
          }
          if (!user.isVerified) {
            throw new Error("Please verify your email to login")
          }
          return user

        } catch (error) {
          throw new Error("Error authorizing user")
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.userName = user.userName;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.isAcceptMessage = user.isAcceptMessage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.userName = token.userName as string;
        session.user.email = token.email as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptMessage = token.isAcceptMessage as boolean;
      }
      return session;
    },
  },
}