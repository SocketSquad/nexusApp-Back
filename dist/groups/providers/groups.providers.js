"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsProviders = void 0;
const group_schema_1 = require("../schemas/group.schema");
exports.groupsProviders = [
    {
        provide: 'GROUP_MODEL',
        useFactory: (mongoose) => mongoose.model('Group', group_schema_1.GroupSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
//# sourceMappingURL=groups.providers.js.map