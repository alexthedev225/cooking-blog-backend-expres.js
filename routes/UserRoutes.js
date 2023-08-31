const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../controllers/UserController");

// Configuration de multer pour le téléchargement de fichiers
const storage = multer.memoryStorage(); // Utilisez memoryStorage pour stocker en tant que données binaires
const upload = multer({ storage: storage });

router.post(
  "/register",
  upload.single("imageProfil"),
  userController.createUser
);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

module.exports = router;
