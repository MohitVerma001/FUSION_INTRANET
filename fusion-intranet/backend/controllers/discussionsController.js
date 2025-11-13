const { supabase } = require('../config/database');

const discussionsController = {
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('discussions')
        .select(`
          *,
          author:users(id, display_name, email),
          place:places(id, name, display_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data: data || []
      });
    } catch (error) {
      console.error('Error fetching discussions:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('discussions')
        .select(`
          *,
          author:users(id, display_name, email),
          place:places(id, name, display_name)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'Discussion not found'
        });
      }

      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching discussion:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const { topic, content_text, author_id, place_id, tags, is_question } = req.body;

      const discussionData = {
        id: `discussion-${Date.now()}`,
        topic,
        content_text,
        author_id,
        place_id,
        tags: tags || [],
        is_question: is_question || false,
        is_answered: false,
        published: new Date().toISOString(),
        updated: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('discussions')
        .insert([discussionData])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error creating discussion:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { topic, content_text, tags, is_question, is_answered } = req.body;

      const { data, error } = await supabase
        .from('discussions')
        .update({
          topic,
          content_text,
          tags,
          is_question,
          is_answered,
          updated: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error updating discussion:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('discussions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Discussion deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting discussion:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = discussionsController;
