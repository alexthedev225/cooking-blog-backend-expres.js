const express = require('express');
const router = express.Router();
const articleController = require('../controllers/ArticleController');
const authMiddleware = require('../middlewares/auth')

// GET /api/articles
router.get('/', articleController.getAllArticles);

// GET /api/articles/:id
router.get('/:id', articleController.getArticleById);

// POST /api/articles
router.post('/', authMiddleware , articleController.createArticle);

// PUT /api/articles/:id
router.put('/:id', articleController.updateArticle);

// DELETE /api/articles/:id
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
