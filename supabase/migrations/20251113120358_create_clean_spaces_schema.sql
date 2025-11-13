/*
  # Create Clean Spaces Schema
  
  ## Overview
  This migration creates a clean, well-structured schema for the social intranet application.
  
  ## Tables Created
  
  ### 1. spaces
  Main container for organizational spaces (e.g., MFTBC, departments, teams)
  - Primary key: id (text)
  - Contains space metadata, tags, and content type configuration
  
  ### 2. content
  Unified content table for all content types (posts, documents, events, polls)
  - Primary key: id (text)
  - Foreign key: space_id references spaces(id)
  - Content type field distinguishes between different content types
  - JSONB fields store rich content data
  
  ## Data Structure
  - All JSON data preserved in JSONB columns
  - Author information stored as JSONB
  - Content body stored as JSONB with text field
  - Images and attachments stored as JSONB arrays
  
  ## Security
  - RLS enabled on all tables
  - Public read access for authenticated users
  - Insert permissions for authenticated users
  
  ## Indexes
  - space_id for fast lookups
  - content_type for filtering
  - published date for sorting
*/

-- ==========================================
-- TABLE: spaces
-- ==========================================
CREATE TABLE spaces (
  id text PRIMARY KEY,
  place_id text,
  name text NOT NULL,
  display_name text,
  description text,
  space_type text DEFAULT 'space',
  content_types jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  published timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE spaces IS 'Main container for organizational spaces (departments, teams, locations)';
COMMENT ON COLUMN spaces.id IS 'Unique identifier from source system';
COMMENT ON COLUMN spaces.content_types IS 'Array of allowed content types: ["blog", "documents", "polls", "events"]';
COMMENT ON COLUMN spaces.tags IS 'Array of space tags for categorization';

-- ==========================================
-- TABLE: content
-- ==========================================
CREATE TABLE content (
  id text PRIMARY KEY,
  space_id text NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  content_type text NOT NULL,
  subject text NOT NULL,
  content_body jsonb NOT NULL,
  author jsonb,
  parent_place jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  content_images jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  
  -- Event-specific fields
  location text,
  phone text,
  start_date timestamptz,
  end_date timestamptz,
  event_access text,
  max_attendees integer,
  attendance jsonb,
  
  -- Poll-specific fields
  poll_question text,
  poll_description text,
  poll_options jsonb DEFAULT '[]'::jsonb,
  allow_multiple_votes boolean DEFAULT false,
  
  -- Engagement metrics
  like_count integer DEFAULT 0,
  follower_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  vote_count integer DEFAULT 0,
  
  -- Metadata
  question boolean DEFAULT false,
  restrict_replies boolean DEFAULT false,
  published timestamptz DEFAULT now(),
  updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE content IS 'Unified content table for all content types (posts, documents, events, polls)';
COMMENT ON COLUMN content.content_type IS 'Type: post, document, event, poll, video, discussion';
COMMENT ON COLUMN content.content_body IS 'JSONB containing the main content with text field';
COMMENT ON COLUMN content.author IS 'JSONB containing author details (id, displayName, jive info)';
COMMENT ON COLUMN content.content_images IS 'JSONB array of images with id, ref, name fields';
COMMENT ON COLUMN content.poll_options IS 'JSONB array of poll options with id, text, votes fields';

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX idx_content_space_id ON content(space_id);
CREATE INDEX idx_content_type ON content(content_type);
CREATE INDEX idx_content_published ON content(published DESC);
CREATE INDEX idx_content_start_date ON content(start_date DESC) WHERE start_date IS NOT NULL;

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

-- Enable RLS
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Spaces policies
CREATE POLICY "Allow public read access to spaces"
  ON spaces FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert spaces"
  ON spaces FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update spaces"
  ON spaces FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Content policies
CREATE POLICY "Allow public read access to content"
  ON content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert content"
  ON content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update content"
  ON content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- VERIFICATION
-- ==========================================
-- Verify tables were created
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'spaces') 
     AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'content') THEN
    RAISE NOTICE '✅ Tables created successfully: spaces, content';
  ELSE
    RAISE EXCEPTION '❌ Table creation failed';
  END IF;
END $$;
