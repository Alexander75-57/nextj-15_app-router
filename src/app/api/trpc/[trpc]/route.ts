import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}), // No context needed for this example
    responseMeta: () => ({
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  });

export { handler as GET, handler as POST, handler as OPTIONS };  