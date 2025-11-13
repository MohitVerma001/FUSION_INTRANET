/*
  # Fix RLS Policies for Data Migration

  ## Changes
  - Update RLS policies to allow data migration with anon key
  - Add policies for INSERT operations
  - Maintain security while allowing initial data load

  ## Security Notes
  - These policies allow authenticated users to insert data
  - In production, you may want to restrict INSERT to specific roles
*/

-- Drop existing restrictive INSERT policies and create permissive ones for data migration

-- Users table policies
DROP POLICY IF EXISTS "Authenticated users can create users" ON users;
CREATE POLICY "Allow inserts for authenticated users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Places table policies  
DROP POLICY IF EXISTS "Authenticated users can create places" ON places;
CREATE POLICY "Allow inserts for authenticated users"
  ON places FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Documents table policies
DROP POLICY IF EXISTS "Authenticated users can create documents" ON documents;
CREATE POLICY "Allow inserts for authenticated users"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Events table policies
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
CREATE POLICY "Allow inserts for authenticated users"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Posts table policies
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
CREATE POLICY "Allow inserts for authenticated users"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Content images table policies
DROP POLICY IF EXISTS "Authenticated users can manage content images" ON content_images;
CREATE POLICY "Allow all operations for authenticated users"
  ON content_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Attachments table policies
DROP POLICY IF EXISTS "Authenticated users can manage attachments" ON attachments;
CREATE POLICY "Allow all operations for authenticated users"
  ON attachments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);