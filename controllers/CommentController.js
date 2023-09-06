const Comment = require('../models/CommentModel');

const commentController = {
  createComment: async (req, res) => {
    try {
      const { content } = req.body;
      const author = req.auth.userId;
      const article = req.params.id
      const newComment = new Comment({
        content,
        author,
        article,
      });
      await newComment.save();
      res.json(newComment);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création du commentaire' });
    }
  },

  getAllComments: async (req, res) => {
    try {
      const comments = await Comment.find();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' });
    }
  },

  getCommentsByArticle: async (req, res) => {
    try {
      const comments = await Comment.find({ article: req.params.articleId });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const deletedComment = await Comment.findByIdAndDelete(req.params.id);
      if (!deletedComment) {
        return res.status(404).json({ message: 'Commentaire non trouvé' });
      }
      res.json({ message: 'Commentaire supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du commentaire' });
    }
  },
};

module.exports = commentController;
