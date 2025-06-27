import { router, publicProcedure } from '@/server/trpc'


import {Feedback} from '@/db/schema';
import { db } from '@/db';
import { FeedbackSchema } from '@/lib/validation';

export const appRouterFeedback = router({
    addFeedback: publicProcedure
        .input(FeedbackSchema)
        .mutation(async ({ input }) => {
            const result = FeedbackSchema.safeParse(input);
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
        })
});