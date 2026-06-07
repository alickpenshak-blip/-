
/*
# Instagram Account Tracker Schema

## Summary
Creates the full database schema for the Instagram Account Tracker & Notes CRM application.
This is a single-tenant app (no user auth), so all tables use anon + authenticated RLS policies
to allow the frontend to read and write freely.

## New Tables

### `profiles`
Stores Instagram account cards with all metadata.
- `id` (text, primary key) — stable client-generated ID (e.g. "profile_ronaldo")
- `username` (text, not null) — Instagram username without @
- `full_name` (text, not null) — display name or brand name
- `followers_count` (text) — formatted follower count like "631M"
- `following_count` (text)
- `posts_count` (text)
- `bio` (text)
- `category` (text)
- `avatar_url` (text)
- `contact_email` (text)
- `location` (text)
- `engagement_rate` (text)
- `tags` (text[]) — array of tag strings
- `notes_count` (int, default 0) — cached count for sidebar display
- `tasks_count` (int, default 0) — cached count for sidebar display
- `contacted` (boolean, default false) — funnel stage 1
- `replied` (boolean, default false) — funnel stage 2
- `agreed` (boolean, default false) — funnel stage 3
- `contacted_at` (timestamptz) — when contacted was first set
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### `notes`
Stores CRM notes attached to a profile.
- `id` (text, primary key)
- `account_id` (text, FK → profiles.id, cascade delete)
- `title` (text, not null)
- `content` (text, not null)
- `category` (text, not null)
- `priority` (text, not null)
- `updated_at` (timestamptz)

### `tasks`
Stores action-item tasks attached to a profile.
- `id` (text, primary key)
- `account_id` (text, FK → profiles.id, cascade delete)
- `text` (text, not null)
- `completed` (boolean, default false)
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- All policies grant anon + authenticated full CRUD (single-tenant, intentionally shared).
*/

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id text PRIMARY KEY,
  username text NOT NULL,
  full_name text NOT NULL,
  followers_count text NOT NULL DEFAULT '0',
  following_count text NOT NULL DEFAULT '0',
  posts_count text NOT NULL DEFAULT '0',
  bio text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Личный блог',
  avatar_url text NOT NULL DEFAULT '',
  contact_email text,
  location text,
  engagement_rate text,
  tags text[] NOT NULL DEFAULT '{}',
  notes_count int NOT NULL DEFAULT 0,
  tasks_count int NOT NULL DEFAULT 0,
  contacted boolean NOT NULL DEFAULT false,
  replied boolean NOT NULL DEFAULT false,
  agreed boolean NOT NULL DEFAULT false,
  contacted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
CREATE POLICY "anon_select_profiles" ON profiles FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profiles" ON profiles;
CREATE POLICY "anon_insert_profiles" ON profiles FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profiles" ON profiles;
CREATE POLICY "anon_update_profiles" ON profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profiles" ON profiles;
CREATE POLICY "anon_delete_profiles" ON profiles FOR DELETE TO anon, authenticated USING (true);

-- NOTES TABLE
CREATE TABLE IF NOT EXISTS notes (
  id text PRIMARY KEY,
  account_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  priority text NOT NULL DEFAULT 'medium',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notes_account_id_idx ON notes(account_id);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_notes" ON notes;
CREATE POLICY "anon_select_notes" ON notes FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_notes" ON notes;
CREATE POLICY "anon_insert_notes" ON notes FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_notes" ON notes;
CREATE POLICY "anon_update_notes" ON notes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_notes" ON notes;
CREATE POLICY "anon_delete_notes" ON notes FOR DELETE TO anon, authenticated USING (true);

-- TASKS TABLE
CREATE TABLE IF NOT EXISTS tasks (
  id text PRIMARY KEY,
  account_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tasks_account_id_idx ON tasks(account_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tasks" ON tasks;
CREATE POLICY "anon_select_tasks" ON tasks FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tasks" ON tasks;
CREATE POLICY "anon_insert_tasks" ON tasks FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tasks" ON tasks;
CREATE POLICY "anon_update_tasks" ON tasks FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tasks" ON tasks;
CREATE POLICY "anon_delete_tasks" ON tasks FOR DELETE TO anon, authenticated USING (true);
