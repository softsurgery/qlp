export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}
export interface UserSummary {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatarUrl?: string;
}
export interface TrackSummary {
    id: string;
    title: string;
    description: string;
    slug: string;
    unitCount: number;
    lessonCount: number;
}
export interface TutorSummary {
    id: string;
    userId: string;
    displayName: string;
    bio: string;
    languages: string[];
    specialties: string[];
    status: string;
    avatarUrl?: string;
    rating?: number;
}
export interface BookingSummary {
    id: string;
    tutorId: string;
    studentId: string;
    startTime: string;
    endTime: string;
    status: string;
    tutorName?: string;
    studentName?: string;
}
export interface AchievementSummary {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    earnedAt?: string;
}
export interface ConversationSummary {
    id: string;
    participantId: string;
    participantName: string;
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount: number;
}
