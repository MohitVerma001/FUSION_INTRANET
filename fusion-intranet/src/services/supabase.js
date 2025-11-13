import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://tadebifghagbrnbtczon.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhZGViaWZnaGFnYnJuYnRjem9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDA3NTQsImV4cCI6MjA3ODYxNjc1NH0.AL0tUV9qyJ3eojRuipfAxe67v5Ft-YsEfROz8YtBbQk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getPostById = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:users!posts_author_id_fkey(id, display_name, email),
      place:places!posts_place_id_fkey(id, name, display_name)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  if (data) {
    const { data: images } = await supabase
      .from('content_images')
      .select('*')
      .eq('content_id', id)
      .eq('content_type', 'post');

    data.images = images || [];
  }

  return data;
};

export const getDocumentById = async (id) => {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      author:users!documents_author_id_fkey(id, display_name, email),
      place:places!documents_place_id_fkey(id, name, display_name)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  if (data) {
    const { data: images } = await supabase
      .from('content_images')
      .select('*')
      .eq('content_id', id)
      .eq('content_type', 'document');

    const { data: attachments } = await supabase
      .from('attachments')
      .select('*')
      .eq('content_id', id)
      .eq('content_type', 'document');

    data.images = images || [];
    data.attachments = attachments || [];
  }

  return data;
};

export const getEventById = async (id) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      author:users!events_author_id_fkey(id, display_name, email),
      place:places!events_place_id_fkey(id, name, display_name)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  if (data) {
    const { data: images } = await supabase
      .from('content_images')
      .select('*')
      .eq('content_id', id)
      .eq('content_type', 'event');

    data.images = images || [];
  }

  return data;
};

export const updatePost = async (id, updates) => {
  const { data, error } = await supabase
    .from('posts')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateDocument = async (id, updates) => {
  const { data, error } = await supabase
    .from('documents')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateEvent = async (id, updates) => {
  const { data, error } = await supabase
    .from('events')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
