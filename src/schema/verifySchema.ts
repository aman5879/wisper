import { z } from 'zod'

export const verifySchema = z.object({
    code: z
        .string()
        .min(4, "Verification code must be at least 4 digits")
        .max(8, "Verification code must not exceed 8 digits")
        .regex(/^\d+$/, "Verification code must contain only digits"),
});