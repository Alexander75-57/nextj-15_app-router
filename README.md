## Project structure

/app
/contact
page.tsx
/database
db.ts
schema.ts
drizzle.config.ts
.env.local

=================================
● Проблемы в файле src/app/contact/page.tsx:14-20:

  1. Неправильное использование tRPC мутации с useActionState - useActionState ожидает server action, а не tRPC мутацию
  2. Некорректная интеграция tRPC - пытается использовать tRPC мутацию как server action в formAction
  3. Конфликт подходов - смешивает Next.js server actions с tRPC клиентскими мутациями

  Нужно выбрать один подход: либо использовать tRPC с клиентской обработкой форм, либо вернуться к server actions с useActionState.

================================

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
