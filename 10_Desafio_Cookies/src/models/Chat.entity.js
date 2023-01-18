import { schema } from "normalizr";

const authorSchema = new schema.Entity("author", {}, { idAttribute: 'mail' });

const messageSchema = new schema.Entity("message", {
    author: authorSchema,
});

const messagesSchema = new schema.Entity("messages", {
    messages: [messageSchema],
});

export { messagesSchema };