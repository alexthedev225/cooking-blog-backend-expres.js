const Article = require("../models/ArticleModel");
const multer = require("multer");

// Configuration de Multer pour gérer le téléchargement d'images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const articleController = {
  getAllArticles: async (req, res) => {
    try {
      let query = [];

      // Vérifiez si le paramètre "limitToFive" est présent et défini à true
      if (req.query.limitToFive === "true") {
        query.push({
          $limit: 5, // Limiter le nombre de documents récupérés à 5
        });
      }

      const articles = await Article.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorData",
          },
        },
        {
          $unwind: "$authorData",
        },
        {
          $project: {
            _id: 1,
            title: 1,
            subTitle: 1,
            content: 1,
            image: 1,
            createdAt: 1,
            author: "$authorData",
          },
        },
        ...query, // Utilisez le tableau de requêtes conditionnelles ici
      ]);

      res.json(articles);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des articles" });
    }
  },

  getArticleById: async (req, res) => {
    try {
      const article = await Article.findById(req.params.id).populate("author"); // Le nom du champ de l'auteur dans le modèle Article

      if (!article) {
        return res.status(404).json({ message: "Article non trouvé" });
      }

      res.json(article);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération de l'article" });
    }
  },
  createArticle: async (req, res) => {
    try {
      // Utilisez la méthode `upload.single` ici pour gérer le téléchargement du fichier
      upload.single("image")(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res
            .status(400)
            .json({ message: "Erreur lors du téléchargement du fichier" });
        } else if (err) {
          return res.status(500).json({
            message:
              "Une erreur s'est produite lors du téléchargement du fichier",
          });
        }

        const { title, content, subTitle } = req.body;
        const image = req.file.buffer; // Récupérez les données binaires du fichier
        const author = req.auth.userId; // Récupérez l'ID de l'utilisateur à partir du token JWT
        const newArticle = new Article({
          title,
          content,
          subTitle,
          image,
          author,
        });
        await newArticle.save();
        res.json(newArticle);
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la création de l'article" });
    }
  },

  updateArticle: async (req, res) => {
    try {
      // Assurez-vous que l'utilisateur est authentifié
      if (!req.auth.userId) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      // Utilisez la méthode `upload.single` pour gérer le téléchargement du fichier
      upload.single("image")(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res
            .status(400)
            .json({ message: "Erreur lors du téléchargement du fichier" });
        } else if (err) {
          return res.status(500).json({
            message:
              "Une erreur s'est produite lors du téléchargement du fichier",
          });
        }

        const { title, content, subTitle } = req.body;
        let image;

        // Vérifiez si un nouveau fichier image a été téléchargé
        if (req.file) {
          image = req.file.buffer; // Récupérez les données binaires du nouveau fichier image
        } else {
          // Si aucun nouveau fichier n'a été téléchargé, conservez l'image existante
          const existingArticle = await Article.findById(req.params.id);
          image = existingArticle.image;
        }

        // Vérifiez si l'utilisateur authentifié est l'auteur de l'article
        const existingArticle = await Article.findById(req.params.id);
        if (existingArticle.author.toString() !== req.auth.userId) {
          return res.status(403).json({ message: "Non autorisé" });
        }

        // Mettez à jour l'article avec les nouvelles données, y compris l'image et l'auteur
        const updatedArticle = await Article.findByIdAndUpdate(
          req.params.id,
          {
            title,
            subTitle,
            content,
            image,
          },
          { new: true }
        );

        if (!updatedArticle) {
          return res.status(404).json({ message: "Article non trouvé" });
        }

        res.json(updatedArticle);
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de l'article" });
    }
  },
  deleteArticle: async (req, res) => {
    try {
      // Assurez-vous que l'utilisateur est authentifié
      if (!req.auth.userId) {
        return res.status(401).json({ message: "Non autorisé" });
      }
  
      // Utilisez findByIdAndRemove pour supprimer l'article
      const deletedArticle = await Article.findByIdAndRemove(req.params.id);
  
      // Vérifiez si l'article a été trouvé et supprimé avec succès
      if (!deletedArticle) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
  
      // Vérifiez si l'utilisateur authentifié est l'auteur de l'article
      if (deletedArticle.author.toString() !== req.auth.userId) {
        return res.status(403).json({ message: "Non autorisé" });
      }
  
      console.log("Article supprimé avec succès");
      res.status(200).json({ message: "Article supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression de l'article" });
    }
  },  
};

module.exports = articleController;
