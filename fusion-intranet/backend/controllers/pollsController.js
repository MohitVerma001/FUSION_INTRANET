const { supabase } = require('../config/database');

const pollsController = {
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('polls')
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
      console.error('Error fetching polls:', error);
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
        .from('polls')
        .select(`
          *,
          author:users(id, display_name, email),
          place:places(id, name, display_name),
          options:poll_options(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'Poll not found'
        });
      }

      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching poll:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const { question, description, author_id, place_id, tags, end_date, allow_multiple_votes, options } = req.body;

      const pollData = {
        id: `poll-${Date.now()}`,
        question,
        description,
        author_id,
        place_id,
        tags: tags || [],
        end_date,
        allow_multiple_votes: allow_multiple_votes || false,
        published: new Date().toISOString(),
        updated: new Date().toISOString()
      };

      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert([pollData])
        .select()
        .single();

      if (pollError) throw pollError;

      if (options && options.length > 0) {
        const optionsData = options.map((option, index) => ({
          poll_id: poll.id,
          option_text: option.text || option,
          display_order: index
        }));

        const { error: optionsError } = await supabase
          .from('poll_options')
          .insert(optionsData);

        if (optionsError) throw optionsError;
      }

      res.status(201).json({
        success: true,
        data: poll
      });
    } catch (error) {
      console.error('Error creating poll:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { question, description, tags, end_date, allow_multiple_votes } = req.body;

      const { data, error } = await supabase
        .from('polls')
        .update({
          question,
          description,
          tags,
          end_date,
          allow_multiple_votes,
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
      console.error('Error updating poll:', error);
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
        .from('polls')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Poll deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting poll:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = pollsController;
