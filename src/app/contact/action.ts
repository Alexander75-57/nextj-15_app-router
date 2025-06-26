"use server";
import { db } from "@/db";
import { Feedback } from "@/db/schema";
import { FeedbackSchema } from "@/lib/validation";

export async function submitFeedback(_: unknown, formData: FormData) {
  const raw = {
    email: formData.get("email")?.toString() || "",
    message: formData.get("message")?.toString() || "",
  };

  const result = FeedbackSchema.safeParse(raw);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    await db.insert(Feedback).values(result.data);
    return { success: true, errors: {} };
  } catch (error) {
    console.error('Database error:', error);
    return { 
      success: false, 
      errors: { 
        general: ['Unable to connect to database. Please try again later.'] 
      } 
    };
  }
}
