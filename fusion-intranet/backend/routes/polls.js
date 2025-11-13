const express = require('express');
const router = express.Router();
const pollsController = require('../controllers/pollsController');

router.get('/', pollsController.getAll);
router.get('/:id', pollsController.getById);
router.post('/', pollsController.create);
router.put('/:id', pollsController.update);
router.delete('/:id', pollsController.delete);

module.exports = router;
