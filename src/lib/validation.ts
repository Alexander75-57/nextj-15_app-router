import { z } from "zod";

export const FeedbackSchema = z.object({
    email: z.string().email("Invalid email address").max(255, "Email must be 255 characters or less"),
    message: z.string().min(1, "Message cannot be empty").max(5000, "Message must be 5000 characters or less"),
})

export type Feedback = z.infer<typeof FeedbackSchema>;