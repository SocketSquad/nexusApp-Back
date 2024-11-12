"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationsProviders = void 0;
const conversations_schema_1 = require("../schemas/conversations.schema");
exports.conversationsProviders = [
    {
        provide: 'CONVERSATION_MODEL',
        useFactory: (mongoose) => mongoose.model('Conversation', conversations_schema_1.ConversationSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
//# sourceMappingURL=conversations.providers.js.map