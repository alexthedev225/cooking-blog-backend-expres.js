const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  imageProfil: { type: Buffer }, // Utiliser le type Buffer pour les données binaires
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
