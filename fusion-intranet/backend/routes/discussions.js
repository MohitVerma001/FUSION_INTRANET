const express = require('express');
const router = express.Router();
const discussionsController = require('../controllers/discussionsController');

router.get('/', discussionsController.getAll);
router.get('/:id', discussionsController.getById);
router.post('/', discussionsController.create);
router.put('/:id', discussionsController.update);
router.delete('/:id', discussionsController.delete);

module.exports = router;
