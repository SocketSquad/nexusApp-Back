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
exports.AttachmentSchema = exports.Attachment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../utils/types");
let AttachmentMetadata = class AttachmentMetadata {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], AttachmentMetadata.prototype, "size", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AttachmentMetadata.prototype, "mimeType", void 0);
AttachmentMetadata = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], AttachmentMetadata);
let Attachment = class Attachment extends mongoose_2.Document {
};
exports.Attachment = Attachment;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(types_1.AttachmentType),
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], Attachment.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Attachment.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Attachment.prototype, "originalName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Attachment.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: AttachmentMetadata, required: true }),
    __metadata("design:type", AttachmentMetadata)
], Attachment.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(types_1.AttachmentStatus),
        default: types_1.AttachmentStatus.PENDING,
        index: true,
    }),
    __metadata("design:type", String)
], Attachment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Message', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Attachment.prototype, "messageId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Attachment.prototype, "userId", void 0);
exports.Attachment = Attachment = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'attachments',
        timestamps: true,
    })
], Attachment);
exports.AttachmentSchema = mongoose_1.SchemaFactory.createForClass(Attachment);
//# sourceMappingURL=attachment.schema.js.map