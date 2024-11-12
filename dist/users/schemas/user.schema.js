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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UserStatus = class UserStatus {
};
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], UserStatus.prototype, "online", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], UserStatus.prototype, "lastSeen", void 0);
UserStatus = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], UserStatus);
let AccountStatus = class AccountStatus {
};
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], AccountStatus.prototype, "isBlocked", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], AccountStatus.prototype, "blockedReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: false }),
    __metadata("design:type", Date)
], AccountStatus.prototype, "blockedAt", void 0);
AccountStatus = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], AccountStatus);
let UserSettings = class UserSettings {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
    }),
    __metadata("design:type", String)
], UserSettings.prototype, "theme", void 0);
UserSettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], UserSettings);
let User = class User extends mongoose_2.Document {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: UserStatus, default: () => ({}) }),
    __metadata("design:type", UserStatus)
], User.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: AccountStatus, default: () => ({}) }),
    __metadata("design:type", AccountStatus)
], User.prototype, "accountStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: UserSettings, default: () => ({}) }),
    __metadata("design:type", UserSettings)
], User.prototype, "settings", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'users',
        timestamps: true,
    })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map