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

      // Get all content from unified table
      const { data: allContent, error: contentError } = await supabase
        .from('content')
        .select('*')
        .eq('space_id', id)
        .order('published', { ascending: false });

      if (contentError) throw contentError;

      // Group content by type for backwards compatibility
      const posts = allContent.filter(c => c.content_type === 'post');
      const documents = allContent.filter(c => c.content_type === 'document');
      const events = allContent.filter(c => c.content_type === 'event');
      const polls = allContent.filter(c => c.content_type === 'poll');

      res.json({
        success: true,
        data: {
          space,
          posts,
          documents,
          events,
          polls
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

      const { data: allContent, error } = await supabase
        .from('content')
        .select('*')
        .eq('space_id', id)
        .order('published', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data: allContent || []
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
