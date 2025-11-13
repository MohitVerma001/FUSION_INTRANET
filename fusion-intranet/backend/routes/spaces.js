const express = require('express');
const router = express.Router();
const spacesController = require('../controllers/spacesController');

// Get all spaces
router.get('/', spacesController.getAll);

// Get space by ID (with all content)
router.get('/:id', spacesController.getById);

// Get all content for a space (unified)
router.get('/:id/content', spacesController.getAllContent);

module.exports = router;
