const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../controllers/UserController");

// Configuration de multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/register",
  upload.single("imageProfil"),
  userController.createUser
);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser)

module.exports = router;
