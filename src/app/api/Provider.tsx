'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import React, { useState } from 'react'

import { trpcClient } from '@/app/api/client'

export function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClientProvider] = useState(() =>
    trpcClient.createClient({
      links: [
        httpBatchLink({
          url: typeof window !== 'undefined' ? `${window.location.origin}/api/trpc` : '/api/trpc',
        }),
      ],
    })
  )

  return (
    <trpcClient.Provider client={trpcClientProvider} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpcClient.Provider>
  )
}

export type AppRouterFeedback = typeof trpcClient
