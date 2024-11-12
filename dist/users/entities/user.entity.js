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
exports.UserEntity = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class UserEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.UserEntity = UserEntity;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj._id.toString()),
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the user',
        example: '507f1f77bcf86cd799439011',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Username of the user',
        example: 'john_doe',
        minLength: 3,
        maxLength: 30,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Email address of the user',
        example: 'john@example.com',
        format: 'email',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ groups: ['profile', 'admin'] }),
    (0, swagger_1.ApiProperty)({
        description: 'User status information (profile and admin only)',
        example: {
            online: true,
            lastSeen: '2024-01-20T12:00:00Z',
        },
        type: 'object',
        properties: {
            online: {
                type: 'boolean',
                description: 'Whether the user is currently online',
            },
            lastSeen: {
                type: 'string',
                format: 'date-time',
                description: 'Last time the user was active',
            },
        },
    }),
    __metadata("design:type", Object)
], UserEntity.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ groups: ['admin'] }),
    (0, swagger_1.ApiProperty)({
        description: 'Account status information (admin only)',
        example: {
            isBlocked: false,
            blockedReason: null,
        },
        type: 'object',
        properties: {
            isBlocked: {
                type: 'boolean',
                description: 'Whether the user account is blocked',
            },
            blockedReason: {
                type: 'string',
                description: 'Reason for account block if applicable',
                nullable: true,
            },
        },
    }),
    __metadata("design:type", Object)
], UserEntity.prototype, "accountStatus", void 0);
//# sourceMappingURL=user.entity.js.map