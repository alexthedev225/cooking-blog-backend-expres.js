const express = require('express');
const categoryController = require('../controllers/CategoryController');

const router = express.Router();

// Création d'une nouvelle catégorie
router.post('/create', categoryController.createCategory);

// Récupération de toutes les catégories
router.get('/', categoryController.getAllCategories);

// Récupération d'une catégorie par son ID
router.get('/:id', categoryController.getCategoryById);

// Mise à jour d'une catégorie par son ID
router.put('/:id', categoryController.updateCategory);

// Suppression d'une catégorie par son ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
