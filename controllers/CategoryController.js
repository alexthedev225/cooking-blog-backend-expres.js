const Category = require('../models/CategoryModel');

const categoryController = {
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const newCategory = new Category({
        name,
      });
      await newCategory.save();
      res.json(newCategory);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de la catégorie' });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de la catégorie' });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie' });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id);
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
      res.json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie' });
    }
  },
};

module.exports = categoryController;
