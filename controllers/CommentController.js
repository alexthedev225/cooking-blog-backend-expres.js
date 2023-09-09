const Comment = require("../models/CommentModel");
const Article = require("../models/ArticleModel");
const User = require("../models/UserModel");
const socketHandler = require("../socketHandler"); // Utilisez le nouveau module pour accéder à io

const commentController = {
  createComment: async (req, res) => {
    try {
      const { content } = req.body;
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
        authorName: authorData.name, // Ajoutez le nom de l'auteur au commentaire
        authorImage: authorData.imageProfil, // Ajoutez l'image de l'auteur au commentaire
        article: articleId,
      });

      const article = await Article.findById(articleId);

      if (!article) {
        socketHandler.getIO().emit("comment_error", "Article non trouvé");
        return res.status(404).json({ message: "Article non trouvé" });
      }

      article.comments.push(newComment);

      await Promise.all([newComment.save(), article.save()]);

      socketHandler.getIO().emit("comments", newComment);


      console.log("Nouveau commentaire émis :", newComment); // Ajoutez cette ligne pour vérifier les données du commentaire émis

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
      const articleId = req.params.id;
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
