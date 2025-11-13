const { supabase } = require('../config/database');

const spacesController = {
  // Get all spaces
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .order('published', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data: data || []
      });
    } catch (error) {
      console.error('Error fetching spaces:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get space by ID with all its content
  async getById(req, res) {
    try {
      const { id } = req.params;

      // Get space
      const { data: space, error: spaceError } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (spaceError) throw spaceError;
      if (!space) {
        return res.status(404).json({
          success: false,
          error: 'Space not found'
        });
      }

      // Get all content for this space
      const [postsRes, docsRes, eventsRes, pollsRes] = await Promise.all([
        supabase.from('posts_json').select('*').eq('space_id', id),
        supabase.from('documents_json').select('*').eq('space_id', id),
        supabase.from('events_json').select('*').eq('space_id', id),
        supabase.from('polls_json').select('*').eq('space_id', id)
      ]);

      res.json({
        success: true,
        data: {
          space,
          posts: postsRes.data || [],
          documents: docsRes.data || [],
          events: eventsRes.data || [],
          polls: pollsRes.data || []
        }
      });
    } catch (error) {
      console.error('Error fetching space:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get all content for a space (unified view)
  async getAllContent(req, res) {
    try {
      const { id } = req.params;

      const [postsRes, docsRes, eventsRes, pollsRes] = await Promise.all([
        supabase.from('posts_json').select('*').eq('space_id', id).order('published', { ascending: false }),
        supabase.from('documents_json').select('*').eq('space_id', id).order('published', { ascending: false }),
        supabase.from('events_json').select('*').eq('space_id', id).order('start_date', { ascending: false }),
        supabase.from('polls_json').select('*').eq('space_id', id).order('published', { ascending: false })
      ]);

      const allContent = [
        ...(postsRes.data || []),
        ...(docsRes.data || []),
        ...(eventsRes.data || []),
        ...(pollsRes.data || [])
      ].sort((a, b) => new Date(b.published || b.start_date) - new Date(a.published || a.start_date));

      res.json({
        success: true,
        data: allContent
      });
    } catch (error) {
      console.error('Error fetching space content:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = spacesController;
