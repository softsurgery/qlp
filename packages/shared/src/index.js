"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = exports.LearnerGoal = exports.LearnerLevel = exports.AchievementCategory = exports.LessonType = exports.BookingStatus = exports.TutorStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "student";
    UserRole["TUTOR"] = "tutor";
    UserRole["PARENT"] = "parent";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var TutorStatus;
(function (TutorStatus) {
    TutorStatus["PENDING"] = "pending";
    TutorStatus["VERIFIED"] = "verified";
    TutorStatus["REJECTED"] = "rejected";
})(TutorStatus || (exports.TutorStatus = TutorStatus = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["REQUESTED"] = "requested";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["IN_PROGRESS"] = "in_progress";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["CANCELLED"] = "cancelled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var LessonType;
(function (LessonType) {
    LessonType["VIDEO"] = "video";
    LessonType["AUDIO"] = "audio";
    LessonType["TEXT"] = "text";
    LessonType["QUIZ"] = "quiz";
})(LessonType || (exports.LessonType = LessonType = {}));
var AchievementCategory;
(function (AchievementCategory) {
    AchievementCategory["STREAK"] = "streak";
    AchievementCategory["LESSON"] = "lesson";
    AchievementCategory["SESSION"] = "session";
    AchievementCategory["MEMORIZATION"] = "memorization";
    AchievementCategory["TAJWEED"] = "tajweed";
})(AchievementCategory || (exports.AchievementCategory = AchievementCategory = {}));
var LearnerLevel;
(function (LearnerLevel) {
    LearnerLevel["BEGINNER"] = "beginner";
    LearnerLevel["INTERMEDIATE"] = "intermediate";
    LearnerLevel["ADVANCED"] = "advanced";
})(LearnerLevel || (exports.LearnerLevel = LearnerLevel = {}));
var LearnerGoal;
(function (LearnerGoal) {
    LearnerGoal["TAJWEED"] = "tajweed";
    LearnerGoal["MEMORIZATION"] = "memorization";
    LearnerGoal["READING"] = "reading";
})(LearnerGoal || (exports.LearnerGoal = LearnerGoal = {}));
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["FILE"] = "file";
    MessageType["SYSTEM"] = "system";
})(MessageType || (exports.MessageType = MessageType = {}));
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map