const express = require('express');
const commentController = require('../controllers/CommentController');

const router = express.Router();

// Création d'un nouveau commentaire
router.post('/create', commentController.createComment);

// Récupération de tous les commentaires
router.get('/', commentController.getAllComments);

// Récupération des commentaires pour un article spécifique
router.get('/article/:articleId', commentController.getCommentsByArticle);

// Suppression d'un commentaire par son ID
router.delete('/:id', commentController.deleteComment);

module.exports = router;
