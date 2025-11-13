/*
  # Clean Schema Reset
  
  This migration removes all existing tables and creates a fresh, clean schema.
  
  ## Tables Dropped
  - All existing space-related tables
  
  ## Purpose
  - Clean slate for proper schema creation
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS poll_votes CASCADE;
DROP TABLE IF EXISTS poll_options CASCADE;
DROP TABLE IF EXISTS polls_json CASCADE;
DROP TABLE IF EXISTS events_json CASCADE;
DROP TABLE IF EXISTS posts_json CASCADE;
DROP TABLE IF EXISTS documents_json CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS spaces CASCADE;
