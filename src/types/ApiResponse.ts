import { Message } from "@/modules/User";

export interface ApiResponse {
    success: boolean,
    message: string,
    isAcceptingMessage?: boolean,
    messages?: Array<Message>
}