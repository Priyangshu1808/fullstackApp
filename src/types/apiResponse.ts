import { message } from "@/model/user";

export interface apiResponse {
    success: boolean;
    message: string;
    isAcceptMessage?: boolean;
    messages?: Array<message>;
}