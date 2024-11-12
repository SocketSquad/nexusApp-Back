"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendStatus = exports.AttachmentStatus = exports.AttachmentType = void 0;
var AttachmentType;
(function (AttachmentType) {
    AttachmentType["IMAGE"] = "image";
    AttachmentType["FILE"] = "file";
})(AttachmentType || (exports.AttachmentType = AttachmentType = {}));
var AttachmentStatus;
(function (AttachmentStatus) {
    AttachmentStatus["PENDING"] = "pending";
    AttachmentStatus["PROCESSING"] = "processing";
    AttachmentStatus["COMPLETED"] = "completed";
    AttachmentStatus["FAILED"] = "failed";
})(AttachmentStatus || (exports.AttachmentStatus = AttachmentStatus = {}));
var FriendStatus;
(function (FriendStatus) {
    FriendStatus["PENDING"] = "pending";
    FriendStatus["ACCEPTED"] = "accepted";
    FriendStatus["BLOCKED"] = "blocked";
})(FriendStatus || (exports.FriendStatus = FriendStatus = {}));
//# sourceMappingURL=types.js.map