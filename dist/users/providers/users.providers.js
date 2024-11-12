"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersProviders = void 0;
const user_schema_1 = require("../schemas/user.schema");
exports.usersProviders = [
    {
        provide: 'USER_MODEL',
        useFactory: (mongoose) => mongoose.model('User', user_schema_1.UserSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
//# sourceMappingURL=users.providers.js.map