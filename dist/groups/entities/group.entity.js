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
exports.GroupEntity = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class GroupMemberEntity {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'User ID of the member' }),
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", String)
], GroupMemberEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role in the group',
        enum: ['admin', 'member'],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GroupMemberEntity.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When the member joined' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GroupMemberEntity.prototype, "joinedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Member permissions' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], GroupMemberEntity.prototype, "permissions", void 0);
class GroupSettingsEntity {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Group privacy setting',
        enum: ['public', 'private'],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GroupSettingsEntity.prototype, "privacy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Require approval to join' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], GroupSettingsEntity.prototype, "joinApproval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Allow members to invite others' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], GroupSettingsEntity.prototype, "allowInvites", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message retention period in days' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GroupSettingsEntity.prototype, "messageRetention", void 0);
class GroupEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.GroupEntity = GroupEntity;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Group ID' }),
    (0, class_transformer_1.Transform)(({ obj }) => obj._id.toString()),
    __metadata("design:type", String)
], GroupEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Group name',
        minLength: 3,
        maxLength: 50,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GroupEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Group description',
        maxLength: 500,
        required: false,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GroupEntity.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Group avatar',
        type: 'object',
        properties: {
            url: { type: 'string' },
            thumbnailUrl: { type: 'string' },
        },
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], GroupEntity.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Group owner ID' }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", String)
], GroupEntity.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Group members',
        type: [GroupMemberEntity],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => GroupMemberEntity),
    __metadata("design:type", Array)
], GroupEntity.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Group settings',
        type: GroupSettingsEntity,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => GroupSettingsEntity),
    __metadata("design:type", GroupSettingsEntity)
], GroupEntity.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Group metadata',
        type: 'object',
        properties: {
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            lastActivityAt: { type: 'string', format: 'date-time' },
        },
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], GroupEntity.prototype, "metadata", void 0);
//# sourceMappingURL=group.entity.js.map