/*
  # Create Complete Spaces Schema from JSON Structure
  
  ## New Tables
  
  1. **spaces** (Parent container)
     - id, placeID, name, displayName
     - description, type
     - contentTypes (JSONB array)
     - tags (JSONB array)
     - published
  
  2. **blogs** (Blog posts with rich HTML content)
     - id, subject, content (JSONB with text field)
     - author (JSONB), space_id (FK to spaces)
     - tags, contentImages (JSONB array)
     - likeCount, followerCount, viewCount
     - published, updated
  
  3. **documents** (Documents with rich HTML content)
     - id, subject, content (JSONB with text field)
     - author (JSONB), space_id (FK to spaces)
     - tags, contentImages (JSONB array), attachments (JSONB array)
     - likeCount, followerCount, viewCount
     - published, updated
  
  4. **polls** (Polls with nested options in JSONB)
     - id, question, description
     - author (JSONB), space_id (FK to spaces)
     - options (JSONB array with nested structure)
     - tags, endDate
     - voteCount, published, updated
  
  5. **posts** (Social posts with rich content)
     - Same structure as blogs
     - Separate table for different content type
  
  6. **events** (Calendar events)
     - id, subject, content (JSONB)
     - author (JSONB), space_id (FK to spaces)
     - location, phone
     - startDate, endDate
     - attendance (JSONB), tags
     - published, updated
  
  ## Relationships
  - All content types have space_id → spaces(id) foreign key
  - Uses JSONB for nested structures (author, content, images, etc.)
  - Preserves exact JSON structure from source files
  
  ## Security
  - RLS enabled on all tables
  - Public read access for authenticated users
*/

-- Create spaces table (parent container)
CREATE TABLE IF NOT EXISTS spaces (
  id text PRIMARY KEY,
  place_id text,
  name text NOT NULL,
  display_name text,
  description text,
  space_type text,
  content_types jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  published timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id text PRIMARY KEY,
  subject text NOT NULL,
  content jsonb NOT NULL,
  space_id text REFERENCES spaces(id) ON DELETE CASCADE,
  author jsonb,
  parent_place jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  content_images jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  like_count integer DEFAULT 0,
  follower_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  question boolean DEFAULT false,
  restrict_replies boolean DEFAULT false,
  content_type text DEFAULT 'post',
  published timestamptz,
  updated timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents_json (
  id text PRIMARY KEY,
  subject text NOT NULL,
  content jsonb NOT NULL,
  space_id text REFERENCES spaces(id) ON DELETE CASCADE,
  author jsonb,
  parent_place jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  content_images jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  like_count integer DEFAULT 0,
  follower_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  question boolean DEFAULT false,
  restrict_replies boolean DEFAULT false,
  content_type text DEFAULT 'document',
  published timestamptz,
  updated timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create posts table (separate from blogs for organization)
CREATE TABLE IF NOT EXISTS posts_json (
  id text PRIMARY KEY,
  subject text NOT NULL,
  content jsonb NOT NULL,
  space_id text REFERENCES spaces(id) ON DELETE CASCADE,
  author jsonb,
  parent_place jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  content_images jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  like_count integer DEFAULT 0,
  follower_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  question boolean DEFAULT false,
  restrict_replies boolean DEFAULT false,
  content_type text DEFAULT 'post',
  published timestamptz,
  updated timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create polls table (with nested options in JSONB)
CREATE TABLE IF NOT EXISTS polls_json (
  id text PRIMARY KEY,
  question text NOT NULL,
  description text,
  space_id text REFERENCES spaces(id) ON DELETE CASCADE,
  author jsonb,
  parent_place jsonb,
  options jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  end_date timestamptz,
  allow_multiple_votes boolean DEFAULT false,
  vote_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  content_type text DEFAULT 'poll',
  published timestamptz,
  updated timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events_json (
  id text PRIMARY KEY,
  subject text NOT NULL,
  content jsonb NOT NULL,
  space_id text REFERENCES spaces(id) ON DELETE CASCADE,
  author jsonb,
  parent_place jsonb,
  location text,
  phone text,
  start_date timestamptz,
  end_date timestamptz,
  event_access text,
  max_attendees integer DEFAULT -1,
  attendance jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  like_count integer DEFAULT 0,
  follower_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  question boolean DEFAULT false,
  restrict_replies boolean DEFAULT false,
  content_type text DEFAULT 'event',
  published timestamptz,
  updated timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blogs_space ON blogs(space_id);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published DESC);
CREATE INDEX IF NOT EXISTS idx_documents_space ON documents_json(space_id);
CREATE INDEX IF NOT EXISTS idx_documents_published ON documents_json(published DESC);
CREATE INDEX IF NOT EXISTS idx_posts_space ON posts_json(space_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts_json(published DESC);
CREATE INDEX IF NOT EXISTS idx_polls_space ON polls_json(space_id);
CREATE INDEX IF NOT EXISTS idx_polls_published ON polls_json(published DESC);
CREATE INDEX IF NOT EXISTS idx_events_space ON events_json(space_id);
CREATE INDEX IF NOT EXISTS idx_events_start ON events_json(start_date DESC);

-- Enable RLS on all tables
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents_json ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts_json ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls_json ENABLE ROW LEVEL SECURITY;
ALTER TABLE events_json ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public read access for spaces"
  ON spaces FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for blogs"
  ON blogs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for documents"
  ON documents_json FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for posts"
  ON posts_json FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for polls"
  ON polls_json FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for events"
  ON events_json FOR SELECT
  TO authenticated
  USING (true);

-- Insert operations for authenticated users
CREATE POLICY "Allow inserts for authenticated users on spaces"
  ON spaces FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users on blogs"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users on documents"
  ON documents_json FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users on posts"
  ON posts_json FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users on polls"
  ON polls_json FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users on events"
  ON events_json FOR INSERT
  TO authenticated
  WITH CHECK (true);