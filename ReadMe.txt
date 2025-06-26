Вот минимальный пример проекта на Next.js 15 (App Router) с использованием Drizzle ORM и MySQL, разбитый по файлам. Он реализует простую форму обратной связи и сохраняет данные в базу.

📁 Структура проекта
/app
  /contact
    page.tsx
/database
  db.ts
  schema.ts
drizzle.config.ts
.env.local
🧬 /database/schema.ts
ts
import { mysqlTable, varchar, text, serial } from "drizzle-orm/mysql-core";

export const feedback = mysqlTable("feedback", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
});
🧬 /database/db.ts
ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export const db = drizzle(pool, { schema });
🧠 drizzle.config.ts
ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./migrations",
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
  },
});
🔐 .env.local
DB_HOST=localhost
DB_USER=root
DB_PASS=admin
DB_NAME=testdb
📄 /app/contact/page.tsx
tsx
"use client";
import { useActionState } from "react";

async function handleSubmit(prev: any, formData: FormData) {
  "use server";
  const { db } = await import("@/database/db");
  const { feedback } = await import("@/database/schema");

  const email = formData.get("email")?.toString() || "";
  const message = formData.get("message")?.toString() || "";

  if (!email.includes("@") || !message) {
    return { error: "Проверьте поля" };
  }

  await db.insert(feedback).values({ email, message });
  return { success: true };
}

export default function ContactPage() {
  const [state, formAction] = useActionState(handleSubmit, { success: false, error: "" });

  return (
    <form action={formAction}>
      <input name="email" placeholder="Email" />
      <textarea name="message" placeholder="Сообщение" />
      <button type="submit">Отправить</button>
      {state.error && <p>{state.error}</p>}
      {state.success && <p>Спасибо!</p>}
    </form>
  );
}
Если хочешь, могу дополнить пример миграциями, Zod-валидацией или сделать версию с react-hook-form. Или хочешь, чтобы я сгенерировал drizzle-kit миграции и SQL?

дополнить Zod-валидацию
Вот как можно дополнить предыдущий пример формы в Next.js 15 с использованием Zod для типизированной валидации прямо внутри useActionState:

📦 Установка Zod
Если ещё не установлено:

bash
npm install zod
🧬 /database/schema.ts (без изменений)
ts
import { mysqlTable, varchar, text, serial } from "drizzle-orm/mysql-core";

export const feedback = mysqlTable("feedback", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
});
🧠 /app/contact/page.tsx с Zod-валидацией
tsx
"use client";
import { useActionState } from "react";
import { z } from "zod";

const FeedbackSchema = z.object({
  email: z.string().email("Некорректный email"),
  message: z.string().min(1, "Сообщение обязательно"),
});

async function handleSubmit(prev: any, formData: FormData) {
  "use server";
  const { db } = await import("@/database/db");
  const { feedback } = await import("@/database/schema");

  const raw = {
    email: formData.get("email")?.toString() || "",
    message: formData.get("message")?.toString() || "",
  };

  const result = FeedbackSchema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, errors };
  }

  await db.insert(feedback).values(result.data);
  return { success: true, errors: {} };
}

export default function ContactPage() {
  const [state, formAction] = useActionState(handleSubmit, {
    success: false,
    errors: {},
  });

  return (
    <form action={formAction}>
      <input name="email" placeholder="Email" />
      {state.errors?.email && <p>{state.errors.email}</p>}

      <textarea name="message" placeholder="Сообщение" />
      {state.errors?.message && <p>{state.errors.message}</p>}

      <button type="submit">Отправить</button>
      {state.success && <p>Спасибо!</p>}
    </form>
  );
}
🧠 Что делает Zod:
Проверяет email и сообщение на сервере.

Возвращает ошибки в flatten().fieldErrors, которые удобно отображать.

Обеспечивает типобезопасность и читаемость.

Хочешь, покажу, как вынести схему и валидацию в отдельный файл или как сделать валидацию и на клиенте тоже?

=========================================================

Вот как можно вынести Zod-схему валидации в отдельный файл и использовать её и на сервере, и на клиенте в Next.js 15 с App Router:

📁 Структура проекта
/app
  /contact
    page.tsx
    action.ts
/lib
  validation.ts
/database
  db.ts
  schema.ts
🧬 /lib/validation.ts — схема и типы
ts
import { z } from "zod";

export const FeedbackSchema = z.object({
  email: z.string().email("Некорректный email"),
  message: z.string().min(1, "Сообщение обязательно"),
});

export type FeedbackInput = z.infer<typeof FeedbackSchema>;
🧠 /app/contact/action.ts — серверная логика
ts
"use server";
import { db } from "@/database/db";
import { feedback } from "@/database/schema";
import { FeedbackSchema } from "@/lib/validation";

export async function submitFeedback(_: any, formData: FormData) {
  const raw = {
    email: formData.get("email")?.toString() || "",
    message: formData.get("message")?.toString() || "",
  };

  const result = FeedbackSchema.safeParse(raw);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await db.insert(feedback).values(result.data);
  return { success: true, errors: {} };
}
📄 /app/contact/page.tsx — клиентская форма с валидацией
tsx
"use client";
import { useActionState } from "react";
import { FeedbackSchema } from "@/lib/validation";
import { submitFeedback } from "./action";

export default function ContactPage() {
  const [state, formAction] = useActionState(submitFeedback, {
    success: false,
    errors: {},
  });

  const handleClientValidation = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const raw = {
      email: formData.get("email")?.toString() || "",
      message: formData.get("message")?.toString() || "",
    };

    const result = FeedbackSchema.safeParse(raw);
    if (!result.success) {
      e.preventDefault(); // блокируем отправку на сервер
    }
  };

  return (
    <form action={formAction} onSubmit={handleClientValidation} noValidate>
      <input name="email" placeholder="Email" />
      {state.errors?.email && <p>{state.errors.email}</p>}

      <textarea name="message" placeholder="Сообщение" />
      {state.errors?.message && <p>{state.errors.message}</p>}

      <button type="submit">Отправить</button>
      {state.success && <p>Спасибо!</p>}
    </form>
  );
}
🔍 Что мы сделали:
Вынесли схему валидации в /lib/validation.ts, чтобы переиспользовать её везде.

На клиенте: валидируем форму до отправки, предотвращая лишние запросы.

На сервере: повторно валидируем данные для безопасности.