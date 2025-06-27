//  tRPC API

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouterFeedback } from '@/server/routers/index'

const handler = (req: Request) => {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouterFeedback,
        createContext: () => ({}), // No context needed for this example
        responseMeta: () => ({
            headers: {
                'Content-Type': 'application/json',
            },
        }),
    });
}
export {handler as GET, handler as POST, handler as OPTIONS };  