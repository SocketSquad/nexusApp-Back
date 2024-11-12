"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const mongoose = require("mongoose");
exports.databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () => {
            try {
                const connection = await mongoose.connect(process.env.DATABASE_URL);
                console.log('Database connected successfully');
                return connection;
            }
            catch (error) {
                console.error('Database connection error:', error);
                throw error;
            }
        },
    },
];
//# sourceMappingURL=database.providers.js.map