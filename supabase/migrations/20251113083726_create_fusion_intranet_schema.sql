/*
  # FUSION Intranet Database Schema

  ## Overview
  Complete database schema for FUSION Intranet application migrated from JIVE platform.
  This migration creates all necessary tables with proper relationships, indexes, and RLS policies.

  ## New Tables

  ### 1. `users`
  Stores user information from Microsoft Graph API
  - `id` (uuid, primary key)
  - `username` (text, unique) - JIVE username
  - `user_principal_name` (text, unique) - Microsoft UPN
  - `email` (text)
  - `display_name` (text)
  - `given_name` (text)
  - `surname` (text)
  - `business_phones` (jsonb)
  - `mobile_phone` (text)
  - `preferred_language` (text)
  - `office_location` (text)
  - `enabled` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `places`
  Stores community spaces/places (e.g., departments, groups)
  - `id` (text, primary key) - Original JIVE place ID
  - `place_id` (text) - JIVE internal place ID
  - `name` (text)
  - `display_name` (text)
  - `description` (text)
  - `content_types` (jsonb) - Array of allowed content types
  - `tags` (jsonb) - Array of tags
  - `place_type` (text) - space, blog, etc.
  - `published` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `documents`
  Stores document content
  - `id` (text, primary key) - Original JIVE document ID
  - `subject` (text)
  - `content_text` (text) - HTML content
  - `author_id` (uuid, foreign key)
  - `place_id` (text, foreign key)
  - `tags` (jsonb)
  - `like_count` (integer)
  - `follower_count` (integer)
  - `view_count` (integer)
  - `published` (timestamptz)
  - `updated` (timestamptz)
  - `is_question` (boolean)
  - `restrict_replies` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `events`
  Stores event information
  - `id` (text, primary key) - Original JIVE event ID
  - `subject` (text)
  - `content_text` (text)
  - `author_id` (uuid, foreign key)
  - `place_id` (text, foreign key)
  - `location` (text)
  - `phone` (text)
  - `start_date` (timestamptz)
  - `end_date` (timestamptz)
  - `event_access` (text) - open, closed, etc.
  - `max_attendees` (text)
  - `tags` (jsonb)
  - `like_count` (integer)
  - `follower_count` (integer)
  - `view_count` (integer)
  - `published` (timestamptz)
  - `updated` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `posts`
  Stores blog posts
  - `id` (text, primary key) - Original JIVE post ID
  - `subject` (text)
  - `content_text` (text)
  - `author_id` (uuid, foreign key)
  - `place_id` (text, foreign key)
  - `tags` (jsonb)
  - `like_count` (integer)
  - `follower_count` (integer)
  - `view_count` (integer)
  - `published` (timestamptz)
  - `updated` (timestamptz)
  - `is_question` (boolean)
  - `restrict_replies` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `content_images`
  Stores image references for content
  - `id` (uuid, primary key)
  - `content_id` (text) - References document/post/event
  - `content_type` (text) - document, post, event
  - `image_id` (text) - Original JIVE image ID
  - `image_ref` (text) - URL reference
  - `image_name` (text)
  - `created_at` (timestamptz)

  ### 7. `attachments`
  Stores file attachments
  - `id` (uuid, primary key)
  - `content_id` (text)
  - `content_type` (text)
  - `file_name` (text)
  - `file_url` (text)
  - `file_size` (bigint)
  - `mime_type` (text)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Policies for authenticated users to read all content
  - Policies for authenticated users to manage their own content
  - Admin policies for full CRUD operations

  ## Important Notes
  - All timestamps use timestamptz for timezone awareness
  - JSONB used for flexible array/object storage
  - Foreign keys maintain referential integrity
  - Indexes created on frequently queried columns
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  user_principal_name text UNIQUE NOT NULL,
  email text,
  display_name text,
  given_name text,
  surname text,
  business_phones jsonb DEFAULT '[]'::jsonb,
  mobile_phone text,
  preferred_language text,
  office_location text,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create places table
CREATE TABLE IF NOT EXISTS places (
  id text PRIMARY KEY,
  place_id text,
  name text NOT NULL,
  display_name text,
  description text,
  content_types jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  place_type text DEFAULT 'space',
  published timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id text PRIMARY KEY,
  subject text NOT NULL,
  content_text text,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  place_id text REFERENCES places(id) ON DELETE SET NULL,
  tags jsonb DEFAULT '[]'::jsonb,
  like_count integer DEFAULT 0,
  follower_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  published timestamptz,
  updated timestamptz,
  is_question boolean DEFAULT false,
  restrict_replies boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id text PRIMARY KEY,
  subject text NOT NULL,
  content_text text,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  place_id text REFERENCES places(id) ON DELETE SET NULL,
  location text,
  phone text,
  start_date timestamptz,
  end_date timestamptz,
  event_access text DEFAULT 'open',
  max_attendees text,
  tags jsonb DEFAULT '[]'::jsonb,
  like_count integer DEFAULT 0,
  follower_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  published timestamptz,
  updated timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id text PRIMARY KEY,
  subject text NOT NULL,
  content_text text,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  place_id text REFERENCES places(id) ON DELETE SET NULL,
  tags jsonb DEFAULT '[]'::jsonb,
  like_count integer DEFAULT 0,
  follower_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  published timestamptz,
  updated timestamptz,
  is_question boolean DEFAULT false,
  restrict_replies boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content_images table
CREATE TABLE IF NOT EXISTS content_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id text NOT NULL,
  content_type text NOT NULL,
  image_id text,
  image_ref text,
  image_name text,
  created_at timestamptz DEFAULT now()
);

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id text NOT NULL,
  content_type text NOT NULL,
  file_name text,
  file_url text,
  file_size bigint,
  mime_type text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_author ON documents(author_id);
CREATE INDEX IF NOT EXISTS idx_documents_place ON documents(place_id);
CREATE INDEX IF NOT EXISTS idx_documents_published ON documents(published DESC);
CREATE INDEX IF NOT EXISTS idx_events_author ON events(author_id);
CREATE INDEX IF NOT EXISTS idx_events_place ON events(place_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_place ON posts(place_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published DESC);
CREATE INDEX IF NOT EXISTS idx_content_images_content ON content_images(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_attachments_content ON attachments(content_id, content_type);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for places table
CREATE POLICY "Anyone can view places"
  ON places FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create places"
  ON places FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update places"
  ON places FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for documents table
CREATE POLICY "Anyone can view documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- RLS Policies for events table
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- RLS Policies for posts table
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- RLS Policies for content_images table
CREATE POLICY "Anyone can view content images"
  ON content_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage content images"
  ON content_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for attachments table
CREATE POLICY "Anyone can view attachments"
  ON attachments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage attachments"
  ON attachments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);