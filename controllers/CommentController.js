const Comment = require("../models/CommentModel");
const Article = require("../models/ArticleModel");
const User = require("../models/UserModel");
const socketHandler = require("../socketHandler"); // Utilisez le nouveau module pour accéder à io

const commentController = {
  createComment: async (req, res) => {
    try {
      const { content } = req.body;
      const createdAt = new Date(); // Initialisez la date de création ici
      const author = req.auth.userId;
      const articleId = req.params.id;

      // Obtenez les informations de l'auteur à partir de la base de données
      const authorData = await User.findById(author);

      if (!authorData) {
        socketHandler.getIO().emit("comment_error", "Auteur non trouvé");
        return res.status(404).json({ message: "Auteur non trouvé" });
      }

      const newComment = new Comment({
        content,
        author,
        authorName: authorData.name,
        authorImage: authorData.imageProfil,
        article: articleId,
        createdAt, // Utilisez la date de création ici
      });

      const article = await Article.findById(articleId);

      if (!article) {
        socketHandler.getIO().emit("comment_error", "Article non trouvé");
        return res.status(404).json({ message: "Article non trouvé" });
      }

      article.comments.push(newComment);

      await Promise.all([newComment.save(), article.save()]);

      // Émettez le nouveau commentaire avec la date de création au format ISO 8601
      socketHandler.getIO().emit(`comments_article_${articleId}`, {
        comment: newComment,
        createdAt: newComment.createdAt.toISOString(), // Format ISO 8601
      });

      console.log("Nouveau commentaire émis :", newComment);

      res.json(newComment);
    } catch (error) {
      console.error("Erreur lors de la création du commentaire", error);
      socketHandler
        .getIO()
        .emit("comment_error", "Erreur lors de la création du commentaire");
      res
        .status(500)
        .json({ message: "Erreur lors de la création du commentaire" });
    }
  },

  getAllComments: async (req, res) => {
    try {
      const comments = await Comment.find().populate("author");
      res.json(comments);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des commentaires" });
    }
  },

  getCommentsByArticle: async (req, res) => {
    try {
      const articleId = req.params.articleId;
      const comments = await Comment.find({ article: articleId });
      res.json(comments);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des commentaires" });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const deletedComment = await Comment.findByIdAndDelete(req.params.id);
      if (!deletedComment) {
        return res.status(404).json({ message: "Commentaire non trouvé" });
      }
      res.json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du commentaire" });
    }
  },
};

module.exports = commentController;
