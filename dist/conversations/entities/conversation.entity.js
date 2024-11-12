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
exports.ConversationEntity = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ParticipantEntity {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'User ID of the participant' }),
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", String)
], ParticipantEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role in conversation',
        enum: ['admin', 'member'],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ParticipantEntity.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when user joined conversation' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ParticipantEntity.prototype, "joinedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last time user read the conversation' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ParticipantEntity.prototype, "lastRead", void 0);
class LastMessageEntity {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Message ID' }),
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", String)
], LastMessageEntity.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message content' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], LastMessageEntity.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of user who sent the message' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", String)
], LastMessageEntity.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Time message was sent' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], LastMessageEntity.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of message',
        enum: ['text', 'image', 'file'],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], LastMessageEntity.prototype, "type", void 0);
class ConversationEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ConversationEntity = ConversationEntity;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Conversation ID' }),
    (0, class_transformer_1.Transform)(({ obj }) => obj._id.toString()),
    __metadata("design:type", String)
], ConversationEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of conversation',
        enum: ['private', 'group'],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ConversationEntity.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of conversation participants',
        type: [ParticipantEntity],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => ParticipantEntity),
    __metadata("design:type", Array)
], ConversationEntity.prototype, "participants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conversation metadata',
        example: {
            createdAt: '2024-01-20T12:00:00Z',
            updatedAt: '2024-01-20T12:00:00Z',
            lastMessageAt: '2024-01-20T12:00:00Z',
        },
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ConversationEntity.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last message in conversation',
        type: LastMessageEntity,
        required: false,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => LastMessageEntity),
    __metadata("design:type", LastMessageEntity)
], ConversationEntity.prototype, "lastMessage", void 0);
//# sourceMappingURL=conversation.entity.js.map