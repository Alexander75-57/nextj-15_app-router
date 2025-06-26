import {
    int,
    mysqlTable,
    varchar,
    timestamp,
    text,
} from 'drizzle-orm/mysql-core';

export const Feedback = mysqlTable("feedback", {
    id: int('id').primaryKey().autoincrement(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    message: text("message").notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
