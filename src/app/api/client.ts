'use client'

import { createTRPCReact } from '@trpc/react-query'
import {appRouterFeedback} from '@/server/routers/index'

export const trpcClient = createTRPCReact<typeof appRouterFeedback>({})

export type AppRouterFeedback = typeof appRouterFeedback
