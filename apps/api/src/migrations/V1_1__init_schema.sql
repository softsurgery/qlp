-- QLP Initial Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student',
  avatar_url VARCHAR(500),
  refresh_token TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_child BOOLEAN DEFAULT FALSE,
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(150),
  bio TEXT,
  preferred_language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  learner_level VARCHAR(20),
  learner_goals TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parent_child_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship VARCHAR(50) DEFAULT 'parent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, child_id)
);

CREATE TABLE tutor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  qualifications TEXT,
  languages TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  intro_video_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending',
  hourly_rate DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tutor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  lesson_type VARCHAR(20) DEFAULT 'text',
  content TEXT,
  media_url VARCHAR(500),
  duration_minutes INT DEFAULT 10,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES tutor_profiles(id),
  student_id UUID NOT NULL REFERENCES users(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'requested',
  notes TEXT,
  video_room_url VARCHAR(500),
  video_room_name VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_a_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_b_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_a_id, participant_b_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_type VARCHAR(20) DEFAULT 'text',
  content TEXT NOT NULL,
  file_url VARCHAR(500),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(30) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  trigger_event VARCHAR(50) NOT NULL,
  trigger_threshold INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_bookings_tutor ON bookings(tutor_id);
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_start ON bookings(start_time);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);

-- Seed achievements
INSERT INTO achievements (name, description, category, icon, trigger_event, trigger_threshold) VALUES
  ('First Steps', 'Complete your first lesson', 'lesson', 'book-open', 'lesson_complete', 1),
  ('Dedicated Learner', 'Complete 5 lessons', 'lesson', 'star', 'lesson_complete', 5),
  ('Qaida Graduate', 'Complete the Qaida track', 'lesson', 'graduation-cap', 'track_complete', 1),
  ('First Session', 'Complete your first live session', 'session', 'video', 'session_complete', 1),
  ('Regular Student', 'Complete 5 live sessions', 'session', 'users', 'session_complete', 5),
  ('3-Day Streak', 'Learn 3 days in a row', 'streak', 'flame', 'streak_days', 3),
  ('Week Warrior', 'Learn 7 days in a row', 'streak', 'zap', 'streak_days', 7),
  ('Welcome', 'Create your account', 'lesson', 'heart', 'account_created', 1)
ON CONFLICT DO NOTHING;

-- Seed Qaida track
INSERT INTO tracks (title, slug, description, sort_order, is_published) VALUES
  ('Qaida - Arabic Letters', 'qaida', 'Learn the Arabic alphabet and basic pronunciation for Quran reading.', 1, TRUE);

INSERT INTO units (track_id, title, description, sort_order)
SELECT id, 'Unit 1: Alif to Kha', 'Introduction to the first group of Arabic letters', 1
FROM tracks WHERE slug = 'qaida';

INSERT INTO units (track_id, title, description, sort_order)
SELECT id, 'Unit 2: Dal to Ghain', 'Second group of Arabic letters', 2
FROM tracks WHERE slug = 'qaida';

INSERT INTO lessons (unit_id, title, description, lesson_type, content, sort_order, duration_minutes)
SELECT u.id, 'Lesson 1: Alif, Ba, Ta', 'Learn the first three letters of the Arabic alphabet', 'text',
  'Alif (ا) is the first letter. Ba (ب) has a dot below. Ta (ت) has two dots above.', 1, 15
FROM units u JOIN tracks t ON u.track_id = t.id WHERE t.slug = 'qaida' AND u.sort_order = 1;

INSERT INTO lessons (unit_id, title, description, lesson_type, content, sort_order, duration_minutes)
SELECT u.id, 'Lesson 2: Tha, Jeem, Ha', 'Continue with the next letters', 'text',
  'Tha (ث) has three dots above. Jeem (ج) has a dot inside. Ha (ح) is a deep H sound.', 2, 15
FROM units u JOIN tracks t ON u.track_id = t.id WHERE t.slug = 'qaida' AND u.sort_order = 1;

INSERT INTO lessons (unit_id, title, description, lesson_type, content, sort_order, duration_minutes)
SELECT u.id, 'Lesson 3: Kha', 'The letter Kha and review', 'text',
  'Kha (خ) is pronounced from the throat. Review all letters learned so far.', 3, 10
FROM units u JOIN tracks t ON u.track_id = t.id WHERE t.slug = 'qaida' AND u.sort_order = 1;

INSERT INTO lessons (unit_id, title, description, lesson_type, content, sort_order, duration_minutes)
SELECT u.id, 'Lesson 1: Dal, Dhal', 'Learn Dal and Dhal', 'text',
  'Dal (د) is a simple D. Dhal (ذ) has a dot above and sounds like TH in "this".', 1, 15
FROM units u JOIN tracks t ON u.track_id = t.id WHERE t.slug = 'qaida' AND u.sort_order = 2;

INSERT INTO lessons (unit_id, title, description, lesson_type, content, sort_order, duration_minutes)
SELECT u.id, 'Lesson 2: Ra, Zay', 'Learn Ra and Zay', 'text',
  'Ra (ر) is rolled lightly. Zay (ز) sounds like Z.', 2, 15
FROM units u JOIN tracks t ON u.track_id = t.id WHERE t.slug = 'qaida' AND u.sort_order = 2;
