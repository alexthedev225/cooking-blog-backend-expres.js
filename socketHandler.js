const socketIo = require("socket.io");
const Comment = require('./models/CommentModel');

let io; // Initialisez io en tant que variable globale pour pouvoir y accéder ailleurs

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: "https://cooking-fever.vercel.app", // Remplacez par l'URL de votre frontend
        methods: ["GET", "POST"],
      },
    }); // Attachez Socket.io au serveur HTTP avec la configuration CORS

    io.on("connection", (socket) => {
      console.log("Client connecté");

      socket.on("disconnect", () => {
        console.log("Client déconnecté");
      });

      // Écoutez l'événement "get_comments_article" pour récupérer les commentaires d'un article spécifique
      socket.on("get_comments_article", async (articleId) => {
        try {
          // Récupérez les commentaires spécifiques à l'article depuis la base de données
          const comments = await Comment.find({ article: articleId });

          // Émettez les commentaires au client
          io.to(socket.id).emit(`comments_article_${articleId}`, comments);
        } catch (error) {
          console.error("Erreur lors de la récupération des commentaires de l'article :", error);
        }
      });
    });
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io non initialisé !");
    }
    return io;
  },
};
