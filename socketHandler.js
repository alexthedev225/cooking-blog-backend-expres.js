const socketIo = require("socket.io");

let io; // Initialisez io en tant que variable globale pour pouvoir y accéder ailleurs

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: "https://cooking-fever.vercel.app/", // Remplacez par l'URL de votre frontend
        methods: ["GET", "POST"],
      },
    }); // Attachez Socket.io au serveur HTTP avec la configuration CORS

    io.on("connection", (socket) => {
      console.log("Client connecté");
      socket.on("disconnect", () => {
        console.log("Client déconnecté");
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
