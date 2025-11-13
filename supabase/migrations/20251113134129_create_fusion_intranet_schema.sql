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
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for places table
CREATE POLICY "Anyone can view places"
  ON places FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create places"
  ON places FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update places"
  ON places FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for documents table
CREATE POLICY "Anyone can view documents"
  ON documents FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create documents"
  ON documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (author_id = auth.uid());

-- RLS Policies for events table
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  USING (author_id = auth.uid());

-- RLS Policies for posts table
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (author_id = auth.uid());

-- RLS Policies for content_images table
CREATE POLICY "Anyone can view content images"
  ON content_images FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage content images"
  ON content_images FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for attachments table
CREATE POLICY "Anyone can view attachments"
  ON attachments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage attachments"
  ON attachments FOR ALL
  USING (true)
  WITH CHECK (true);