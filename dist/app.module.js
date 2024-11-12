"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./database/database.module");
const conversations_module_1 = require("./conversations/conversations.module");
const users_module_1 = require("./users/users.module");
const groups_module_1 = require("./groups/groups.module");
const messages_module_1 = require("./messages/messages.module");
const message_attachments_module_1 = require("./message-attachments/message-attachments.module");
const friends_module_1 = require("./friends/friends.module");
const friends_requests_module_1 = require("./friends-requests/friends-requests.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            database_module_1.DatabaseModule,
            conversations_module_1.ConversationsModule,
            users_module_1.UsersModule,
            groups_module_1.GroupsModule,
            messages_module_1.MessagesModule,
            message_attachments_module_1.MessageAttachmentsModule,
            friends_module_1.FriendsModule,
            friends_requests_module_1.FriendsRequestsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map