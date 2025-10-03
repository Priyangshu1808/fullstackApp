import z from "zod";
import { User } from "../model/user";
import UserModel from "../model/user";

export const userNameValidation = z
.string()
.min(3, { message: "Username must be at least 3 characters long" })
.max(20, { message: "Username must be at most 20 characters long" })
.regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" });

export const signUpSchema = z.object({
    userName: userNameValidation,
    email: z.string().email({message:'invalid email'}),
    password: z.string().min(6, 'Password must be 6 character')
    
})