-- Create spaces table (parent container)
CREATE TABLE IF NOT EXISTS spaces (
  id UUID PRIMARY KEY,                         -- Unique identifier for the space
  placeid TEXT,                                -- Place ID (unique identifier)
  name TEXT NOT NULL,                          -- Space name
  displayname TEXT,                            -- Display name for the space
  description TEXT,                            -- Description of the space
  spacetype TEXT,                              -- Type of space (e.g., 'space')
  content_types JSONB DEFAULT '[]'::jsonb,     -- Array of content types (JSONB)
  tags JSONB DEFAULT '[]'::jsonb,              -- Array of tags (JSONB)
  published TIMESTAMPTZ,                       -- Published timestamp
  created_at TIMESTAMPTZ DEFAULT now(),        -- Created timestamp
  updated_at TIMESTAMPTZ DEFAULT now()         -- Updated timestamp
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY,                         -- Unique identifier for the blog post
  subject TEXT NOT NULL,                       -- Subject of the blog post
  content JSONB NOT NULL,                      -- Content in JSONB format (rich HTML content)
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE, -- Foreign key referencing spaces table
  author JSONB,                                -- Author information (JSONB)
  tags JSONB DEFAULT '[]'::jsonb,              -- Array of tags (JSONB)
  content_images JSONB DEFAULT '[]'::jsonb,    -- Array of content images (JSONB)
  attachments JSONB DEFAULT '[]'::jsonb,       -- Array of attachments (JSONB)
  like_count INTEGER DEFAULT 0,                -- Like count
  follower_count INTEGER DEFAULT 0,            -- Follower count
  view_count INTEGER DEFAULT 0,                -- View count
  question BOOLEAN DEFAULT false,              -- Indicates if the post is a question
  restrict_replies BOOLEAN DEFAULT false,      -- Restrict replies (boolean)
  content_type TEXT DEFAULT 'post',            -- Type of content
  published TIMESTAMPTZ,                       -- Published timestamp
  updated TIMESTAMPTZ,                         -- Updated timestamp
  created_at TIMESTAMPTZ DEFAULT now()         -- Created timestamp
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY,                         -- Unique identifier for the document
  subject TEXT NOT NULL,                       -- Subject of the document
  content JSONB NOT NULL,                      -- Content in JSONB format (rich HTML content)
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE, -- Foreign key referencing spaces table
  author JSONB,                                -- Author information (JSONB)
  tags JSONB DEFAULT '[]'::jsonb,              -- Array of tags (JSONB)
  content_images JSONB DEFAULT '[]'::jsonb,    -- Array of content images (JSONB)
  attachments JSONB DEFAULT '[]'::jsonb,       -- Array of attachments (JSONB)
  like_count INTEGER DEFAULT 0,                -- Like count
  follower_count INTEGER DEFAULT 0,            -- Follower count
  view_count INTEGER DEFAULT 0,                -- View count
  question BOOLEAN DEFAULT false,              -- Indicates if the document is a question
  restrict_replies BOOLEAN DEFAULT false,      -- Restrict replies (boolean)
  content_type TEXT DEFAULT 'document',        -- Type of content
  published TIMESTAMPTZ,                       -- Published timestamp
  updated TIMESTAMPTZ,                         -- Updated timestamp
  created_at TIMESTAMPTZ DEFAULT now()         -- Created timestamp
);

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY,                         -- Unique identifier for the poll
  question TEXT NOT NULL,                      -- Question for the poll
  description TEXT,                            -- Description of the poll
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE, -- Foreign key referencing spaces table
  author JSONB,                                -- Author information (JSONB)
  options JSONB DEFAULT '[]'::jsonb,           -- Array of options (JSONB)
  tags JSONB DEFAULT '[]'::jsonb,              -- Array of tags (JSONB)
  end_date TIMESTAMPTZ,                        -- End date for the poll
  allow_multiple_votes BOOLEAN DEFAULT false,  -- Allow multiple votes (boolean)
  vote_count INTEGER DEFAULT 0,                -- Total vote count
  view_count INTEGER DEFAULT 0,                -- View count
  content_type TEXT DEFAULT 'poll',            -- Type of content
  published TIMESTAMPTZ,                       -- Published timestamp
  updated TIMESTAMPTZ,                         -- Updated timestamp
  created_at TIMESTAMPTZ DEFAULT now()         -- Created timestamp
);

-- Create posts table (separate from blogs for organization)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY,                         -- Unique identifier for the post
  subject TEXT NOT NULL,                       -- Subject of the post
  content JSONB NOT NULL,                      -- Content in JSONB format (rich HTML content)
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE, -- Foreign key referencing spaces table
  author JSONB,                                -- Author information (JSONB)
  tags JSONB DEFAULT '[]'::jsonb,              -- Array of tags (JSONB)
  content_images JSONB DEFAULT '[]'::jsonb,    -- Array of content images (JSONB)
  attachments JSONB DEFAULT '[]'::jsonb,       -- Array of attachments (JSONB)
  like_count INTEGER DEFAULT 0,                -- Like count
  follower_count INTEGER DEFAULT 0,            -- Follower count
  view_count INTEGER DEFAULT 0,                -- View count
  question BOOLEAN DEFAULT false,              -- Indicates if the post is a question
  restrict_replies BOOLEAN DEFAULT false,      -- Restrict replies (boolean)
  content_type TEXT DEFAULT 'post',            -- Type of content
  published TIMESTAMPTZ,                       -- Published timestamp
  updated TIMESTAMPTZ,                         -- Updated timestamp
  created_at TIMESTAMPTZ DEFAULT now()         -- Created timestamp
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY,                         -- Unique identifier for the event
  subject TEXT NOT NULL,                       -- Subject of the event
  content JSONB NOT NULL,                      -- Content in JSONB format (event details)
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE, -- Foreign key referencing spaces table
  author JSONB,                                -- Author information (JSONB)
  location TEXT,                               -- Event location
  phone TEXT,                                  -- Contact phone
  start_date TIMESTAMPTZ,                      -- Start date for the event
  end_date TIMESTAMPTZ,                        -- End date for the event
  event_access TEXT,                           -- Event access type
  max_attendees INTEGER DEFAULT -1,            -- Max attendees
  attendance JSONB,                            -- Attendance list (JSONB)
  tags JSONB DEFAULT '[]'::jsonb,              -- Array of tags (JSONB)
  like_count INTEGER DEFAULT 0,                -- Like count
  follower_count INTEGER DEFAULT 0,            -- Follower count
  view_count INTEGER DEFAULT 0,                -- View count
  question BOOLEAN DEFAULT false,              -- Indicates if the event is a question
  restrict_replies BOOLEAN DEFAULT false,      -- Restrict replies (boolean)
  content_type TEXT DEFAULT 'event',           -- Type of content
  published TIMESTAMPTZ,                       -- Published timestamp
  updated TIMESTAMPTZ,                         -- Updated timestamp
  created_at TIMESTAMPTZ DEFAULT now()         -- Created timestamp
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blogs_space ON blogs(space_id);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published DESC);
CREATE INDEX IF NOT EXISTS idx_documents_space ON documents(space_id);
CREATE INDEX IF NOT EXISTS idx_documents_published ON documents(published DESC);
CREATE INDEX IF NOT EXISTS idx_posts_space ON posts(space_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published DESC);
CREATE INDEX IF NOT EXISTS idx_polls_space ON polls(space_id);
CREATE INDEX IF NOT EXISTS idx_polls_published ON polls(published DESC);
CREATE INDEX IF NOT EXISTS idx_events_space ON events(space_id);
CREATE INDEX IF NOT EXISTS idx_events_start ON events(start_date DESC);

-- Enable Row Level Security on all tables
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create Row Level Security policies for public read access
CREATE POLICY "Public read access for spaces"
  ON spaces FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for blogs"
  ON blogs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for polls"
  ON polls FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access for events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- Create Row Level Security policies for inserts by authenticated users
CREATE POLICY "Allow inserts for authenticated users on spaces"
  ON spaces FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users on blogs"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users on documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users on posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users on polls"
  ON polls FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users on events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);
