import { z } from "zod";

export const messageSchema = z.object({
    senderUsername: z
        .string()
        .trim()
        .min(1, "Please enter a username.")
        .max(30, "Username cannot exceed 30 characters."),

    content: z
        .string()
        .trim()
        .min(10, "Message must be at least 10 characters long.")
        .max(2000, "Message cannot exceed 2000 characters.")
        .refine((value) => value.length > 0, {
            message: "Message cannot be empty.",
        }),
});
