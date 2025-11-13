const supabase = require('../config/database');

exports.getAllDocuments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        author:users(id, display_name, email),
        place:places(id, name)
      `)
      .order('published', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        author:users(id, display_name, email),
        place:places(id, name),
        images:content_images!content_id(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createDocument = async (req, res) => {
  try {
    const documentData = req.body;
    const { data, error } = await supabase
      .from('documents')
      .insert([documentData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const documentData = req.body;
    documentData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('documents')
      .update(documentData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
