const supabase = require('../config/database');

exports.getAllPlaces = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('name', { ascending: true });

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

exports.getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
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

exports.createPlace = async (req, res) => {
  try {
    const placeData = req.body;
    const { data, error } = await supabase
      .from('places')
      .insert([placeData])
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

exports.updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const placeData = req.body;
    placeData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('places')
      .update(placeData)
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

exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Place deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
