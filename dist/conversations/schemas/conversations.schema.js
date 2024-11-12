"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationSchema = exports.Conversation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Participant = class Participant {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Participant.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['admin', 'member'],
        default: 'member',
    }),
    __metadata("design:type", String)
], Participant.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Participant.prototype, "joinedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Participant.prototype, "lastRead", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Participant.prototype, "isArchived", void 0);
Participant = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Participant);
let ConversationMetadata = class ConversationMetadata {
};
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], ConversationMetadata.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], ConversationMetadata.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ConversationMetadata.prototype, "lastMessageAt", void 0);
ConversationMetadata = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ConversationMetadata);
let LastMessage = class LastMessage {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], LastMessage.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], LastMessage.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], LastMessage.prototype, "senderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], LastMessage.prototype, "sentAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text',
    }),
    __metadata("design:type", String)
], LastMessage.prototype, "type", void 0);
LastMessage = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], LastMessage);
let Conversation = class Conversation extends mongoose_2.Document {
};
exports.Conversation = Conversation;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['private', 'group'],
        required: true,
    }),
    __metadata("design:type", String)
], Conversation.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Participant], required: true }),
    __metadata("design:type", Array)
], Conversation.prototype, "participants", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ConversationMetadata, default: () => ({}) }),
    __metadata("design:type", ConversationMetadata)
], Conversation.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: LastMessage }),
    __metadata("design:type", LastMessage)
], Conversation.prototype, "lastMessage", void 0);
exports.Conversation = Conversation = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'conversations',
        timestamps: true,
    })
], Conversation);
exports.ConversationSchema = mongoose_1.SchemaFactory.createForClass(Conversation);
//# sourceMappingURL=conversations.schema.js.map