// инициализирует tRPC сервер и экспортирует базовые утилиты:
// - trpc - основной экземпляр tRPC сервера
// - router - функция для создания роутеров
// - publicProcedure - базовая процедура для создания API endpoints


import { initTRPC } from '@trpc/server';

export const trpc = initTRPC.create();

// Base router and procedure helpers
export const router = trpc.router
export const publicProcedure = trpc.procedure