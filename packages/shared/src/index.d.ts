export declare enum UserRole {
    STUDENT = "student",
    TUTOR = "tutor",
    PARENT = "parent",
    ADMIN = "admin"
}
export declare enum TutorStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    REJECTED = "rejected"
}
export declare enum BookingStatus {
    REQUESTED = "requested",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum LessonType {
    VIDEO = "video",
    AUDIO = "audio",
    TEXT = "text",
    QUIZ = "quiz"
}
export declare enum AchievementCategory {
    STREAK = "streak",
    LESSON = "lesson",
    SESSION = "session",
    MEMORIZATION = "memorization",
    TAJWEED = "tajweed"
}
export declare enum LearnerLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export declare enum LearnerGoal {
    TAJWEED = "tajweed",
    MEMORIZATION = "memorization",
    READING = "reading"
}
export declare enum MessageType {
    TEXT = "text",
    FILE = "file",
    SYSTEM = "system"
}
export * from './types';
