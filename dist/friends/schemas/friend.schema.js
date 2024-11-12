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
exports.FriendSchema = exports.Friend = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../utils/types");
let Friend = class Friend extends mongoose_2.Document {
};
exports.Friend = Friend;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Friend.prototype, "senderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Friend.prototype, "receiverId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(types_1.FriendStatus),
        default: types_1.FriendStatus.PENDING,
        index: true,
    }),
    __metadata("design:type", String)
], Friend.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Friend.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Friend.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Friend.prototype, "acceptedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Friend.prototype, "blockedAt", void 0);
exports.Friend = Friend = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'friends',
        timestamps: true,
    })
], Friend);
exports.FriendSchema = mongoose_1.SchemaFactory.createForClass(Friend);
//# sourceMappingURL=friend.schema.js.map