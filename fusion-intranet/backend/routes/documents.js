const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');

router.get('/', documentsController.getAllDocuments);
router.get('/:id', documentsController.getDocumentById);
router.post('/', documentsController.createDocument);
router.put('/:id', documentsController.updateDocument);
router.delete('/:id', documentsController.deleteDocument);

module.exports = router;
