import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      appName: 'QLP',
      tagline: 'Quran Learning Platform',
      nav: {
        dashboard: 'Dashboard',
        curriculum: 'Curriculum',
        tutors: 'Tutors',
        bookings: 'Bookings',
        chat: 'Chat',
        profile: 'Profile',
        achievements: 'Achievements',
        admin: 'Admin',
        children: 'My Children',
        logout: 'Logout',
      },
      auth: {
        login: 'Sign In',
        register: 'Create Account',
        email: 'Email',
        password: 'Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        role: 'I am a',
        student: 'Student',
        parent: 'Parent',
        tutor: 'Tutor',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
      },
      dashboard: {
        welcome: 'Welcome back',
        progress: 'Your Progress',
        upcoming: 'Upcoming Sessions',
        recentAchievements: 'Recent Achievements',
        startLearning: 'Start Learning',
        findTutor: 'Find a Tutor',
      },
      curriculum: {
        title: 'Curriculum',
        units: 'Units',
        lessons: 'Lessons',
        complete: 'Mark Complete',
        completed: 'Completed',
        progress: 'Progress',
      },
      tutors: {
        title: 'Find a Tutor',
        book: 'Book Session',
        languages: 'Languages',
        specialties: 'Specialties',
        rating: 'Rating',
        apply: 'Apply as Tutor',
      },
      bookings: {
        title: 'My Bookings',
        confirm: 'Confirm',
        cancel: 'Cancel',
        join: 'Join Video',
        complete: 'Complete Session',
        status: 'Status',
      },
      chat: {
        title: 'Messages',
        placeholder: 'Type a message...',
        send: 'Send',
        noConversations: 'No conversations yet',
      },
      profile: {
        title: 'Profile',
        save: 'Save Changes',
        displayName: 'Display Name',
        bio: 'Bio',
        language: 'Preferred Language',
        timezone: 'Timezone',
        level: 'Learning Level',
        goals: 'Learning Goals',
      },
      achievements: {
        title: 'Achievements',
        earned: 'Earned',
        available: 'Available',
        streak: 'Current Streak',
        days: 'days',
      },
      parent: {
        title: 'My Children',
        addChild: 'Add Child',
        viewProgress: 'View Progress',
      },
      admin: {
        title: 'Admin Panel',
        users: 'Users',
        tutors: 'Tutor Verification',
        curriculum: 'Curriculum',
        verify: 'Verify',
        reject: 'Reject',
      },
    },
  },
  ar: {
    translation: {
      appName: 'منصة القرآن',
      tagline: 'منصة تعليم القرآن الكريم',
      nav: {
        dashboard: 'لوحة التحكم',
        curriculum: 'المنهج',
        tutors: 'المعلمون',
        bookings: 'الحجوزات',
        chat: 'المحادثات',
        profile: 'الملف الشخصي',
        achievements: 'الإنجازات',
        admin: 'الإدارة',
        children: 'أطفالي',
        logout: 'تسجيل الخروج',
      },
      auth: {
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        firstName: 'الاسم الأول',
        lastName: 'اسم العائلة',
        role: 'أنا',
        student: 'طالب',
        parent: 'ولي أمر',
        tutor: 'معلم',
        noAccount: 'ليس لديك حساب؟',
        hasAccount: 'لديك حساب بالفعل؟',
      },
      dashboard: {
        welcome: 'مرحباً بعودتك',
        progress: 'تقدمك',
        upcoming: 'الجلسات القادمة',
        recentAchievements: 'الإنجازات الأخيرة',
        startLearning: 'ابدأ التعلم',
        findTutor: 'ابحث عن معلم',
      },
      curriculum: {
        title: 'المنهج',
        units: 'الوحدات',
        lessons: 'الدروس',
        complete: 'إكمال الدرس',
        completed: 'مكتمل',
        progress: 'التقدم',
      },
      tutors: {
        title: 'ابحث عن معلم',
        book: 'حجز جلسة',
        languages: 'اللغات',
        specialties: 'التخصصات',
        rating: 'التقييم',
        apply: 'التقديم كمعلم',
      },
      bookings: {
        title: 'حجوزاتي',
        confirm: 'تأكيد',
        cancel: 'إلغاء',
        join: 'انضم للفيديو',
        complete: 'إنهاء الجلسة',
        status: 'الحالة',
      },
      chat: {
        title: 'الرسائل',
        placeholder: 'اكتب رسالة...',
        send: 'إرسال',
        noConversations: 'لا توجد محادثات',
      },
      profile: {
        title: 'الملف الشخصي',
        save: 'حفظ التغييرات',
        displayName: 'اسم العرض',
        bio: 'نبذة',
        language: 'اللغة المفضلة',
        timezone: 'المنطقة الزمنية',
        level: 'مستوى التعلم',
        goals: 'أهداف التعلم',
      },
      achievements: {
        title: 'الإنجازات',
        earned: 'المكتسبة',
        available: 'المتاحة',
        streak: 'سلسلة الأيام',
        days: 'أيام',
      },
      parent: {
        title: 'أطفالي',
        addChild: 'إضافة طفل',
        viewProgress: 'عرض التقدم',
      },
      admin: {
        title: 'لوحة الإدارة',
        users: 'المستخدمون',
        tutors: 'التحقق من المعلمين',
        curriculum: 'المنهج',
        verify: 'تحقق',
        reject: 'رفض',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

if (i18n.language === 'ar') {
  document.documentElement.dir = 'rtl';
}

export default i18n;
