import { router, publicProcedure } from '@/server/trpc';
import { db } from '@/db';
import { Feedback } from '@/db/schema';
import { FeedbackSchema } from '@/lib/validation';
import { TRPCError } from '@trpc/server';

export const appRouter = router({
  addFeedback: publicProcedure.input(FeedbackSchema).mutation(async ({ input }) => {
    try {
      await db.insert(Feedback).values(input);
      return { success: true };
    } catch (error) {
      console.error('Database error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unable to connect to database. Please try again later.',
      });
    }
  }),
});

export type AppRouter = typeof appRouter;
