import { z } from "zod";

export const acceptMessageSchema = z.object({
    acceptMessage: z.boolean({
        error: "Please specify whether messages are accepted.",
    }),
});