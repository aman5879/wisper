import { z } from "zod";

export const signInSchema = z.object({
    identifier: z
        .string()
        .trim()
        .min(1, "Username or email is required")
        .max(100, "Identifier is too long"),

    password: z
        .string()
        .min(6, "Password must be at least 8 characters")
        .max(100, "Password must not exceed 100 characters"),
});