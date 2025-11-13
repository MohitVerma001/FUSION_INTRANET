const { supabase } = require('../config/database');

const videosController = {
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('videos')
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
      console.error('Error fetching videos:', error);
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
        .from('videos')
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
          error: 'Video not found'
        });
      }

      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching video:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const { title, description, video_url, thumbnail_url, duration, author_id, place_id, tags } = req.body;

      const videoData = {
        id: `video-${Date.now()}`,
        title,
        description,
        video_url,
        thumbnail_url,
        duration,
        author_id,
        place_id,
        tags: tags || [],
        published: new Date().toISOString(),
        updated: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('videos')
        .insert([videoData])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error creating video:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, video_url, thumbnail_url, duration, tags } = req.body;

      const { data, error } = await supabase
        .from('videos')
        .update({
          title,
          description,
          video_url,
          thumbnail_url,
          duration,
          tags,
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
      console.error('Error updating video:', error);
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
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Video deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = videosController;
