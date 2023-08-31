const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/UserRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const articleRoutes = require("./routes/ArticleRoutes");
const commentRoutes = require("./routes/CommentRoutes");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT;

const MONGO_DB_URI = process.env.MONGO_DB_URI;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose
  .connect(MONGO_DB_URI)
  .then(console.log("Base de données connectée avec succès"))
  .catch((error) => console.error(error));

app.use("/api/users", userRoutes); // Utilisateurs
app.use("/api/categories", categoryRoutes); // Catégories
app.use("/api/articles", articleRoutes); // Articles
app.use("/api/comments", commentRoutes); // Commentaires

app.listen(PORT, () => {
  console.log(`App listening on PORT http://localhost:${PORT}`);
});
