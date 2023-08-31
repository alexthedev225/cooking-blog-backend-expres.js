const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const User = require("../models/UserModel");

const JWT_SECRET = process.env.JWT_SECRET;

// Fonction de création d'utilisateur
exports.createUser = (req, res) => {
  bcrypt
    .hash(req.body.password, 10) // Hashage du mot de passe
    .then((hash) => {
      const { username, name, email } = req.body;
      const user = new User({
        username,
        password: hash,
        name,
        email,
        imageProfil: req.file.buffer, // Chemin du fichier téléchargé
      });
      user
        .save()
        .then((result) => {
          res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: result,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    });
};

// Fonction de connexion de l'utilisateur
exports.loginUser = (req, res) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentification échouée",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Authentification échouée",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((error) => {
      return res.status(401).json({
        message: "Authentification échouée",
      });
    });
};

// Ajoutez cette nouvelle route à votre contrôleur

exports.logoutUser = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    message: "Déconnexion réussie",
  });
};
