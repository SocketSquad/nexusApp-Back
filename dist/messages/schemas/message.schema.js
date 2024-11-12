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
exports.MessageSchema = exports.Message = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Mention = class Mention {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Mention.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Mention.prototype, "username", void 0);
Mention = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Mention);
let MessageContent = class MessageContent {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MessageContent.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Mention], default: [] }),
    __metadata("design:type", Array)
], MessageContent.prototype, "mentions", void 0);
MessageContent = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], MessageContent);
let Attachment = class Attachment {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Attachment' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Attachment.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['image', 'file'],
        required: true,
    }),
    __metadata("design:type", String)
], Attachment.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Attachment.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], Attachment.prototype, "metadata", void 0);
Attachment = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Attachment);
let DeliveryStatus = class DeliveryStatus {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], DeliveryStatus.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], DeliveryStatus.prototype, "timestamp", void 0);
DeliveryStatus = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], DeliveryStatus);
let MessageStatus = class MessageStatus {
};
__decorate([
    (0, mongoose_1.Prop)({ type: [DeliveryStatus], default: [] }),
    __metadata("design:type", Array)
], MessageStatus.prototype, "delivered", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [DeliveryStatus], default: [] }),
    __metadata("design:type", Array)
], MessageStatus.prototype, "read", void 0);
MessageStatus = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], MessageStatus);
let ReplyTo = class ReplyTo {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Message' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], ReplyTo.prototype, "messageId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReplyTo.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], ReplyTo.prototype, "senderId", void 0);
ReplyTo = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ReplyTo);
let MessageMetadata = class MessageMetadata {
};
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], MessageMetadata.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], MessageMetadata.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], MessageMetadata.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], MessageMetadata.prototype, "editedAt", void 0);
MessageMetadata = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], MessageMetadata);
let Message = class Message extends mongoose_2.Document {
};
exports.Message = Message;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Message.prototype, "conversationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Message.prototype, "senderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text',
        index: true,
    }),
    __metadata("design:type", String)
], Message.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: MessageContent, required: true }),
    __metadata("design:type", MessageContent)
], Message.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Attachment], default: [] }),
    __metadata("design:type", Array)
], Message.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: MessageStatus, default: () => ({}) }),
    __metadata("design:type", MessageStatus)
], Message.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ReplyTo }),
    __metadata("design:type", ReplyTo)
], Message.prototype, "replyTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: MessageMetadata, default: () => ({}) }),
    __metadata("design:type", MessageMetadata)
], Message.prototype, "metadata", void 0);
exports.Message = Message = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'messages',
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })
], Message);
exports.MessageSchema = mongoose_1.SchemaFactory.createForClass(Message);
//# sourceMappingURL=message.schema.js.map