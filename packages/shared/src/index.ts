export enum UserRole {
  STUDENT = 'student',
  TUTOR = 'tutor',
  PARENT = 'parent',
  ADMIN = 'admin',
}

export enum TutorStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum BookingStatus {
  REQUESTED = 'requested',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum LessonType {
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text',
  QUIZ = 'quiz',
}

export enum AchievementCategory {
  STREAK = 'streak',
  LESSON = 'lesson',
  SESSION = 'session',
  MEMORIZATION = 'memorization',
  TAJWEED = 'tajweed',
}

export enum LearnerLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum LearnerGoal {
  TAJWEED = 'tajweed',
  MEMORIZATION = 'memorization',
  READING = 'reading',
}

export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  SYSTEM = 'system',
}

export * from './types';
