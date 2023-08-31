const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Référence à la catégorie de l'article
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Références aux commentaires liés à l'article
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
