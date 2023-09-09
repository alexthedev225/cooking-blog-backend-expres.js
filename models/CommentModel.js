const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  createdAt: { type: Date, default: Date.now },
  authorName: { type: String }, // Ajoutez le nom de l'auteur au commentaire
  authorImage: { type: Buffer }, // Ajoutez l'image de l'auteur au commentaire
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
