const mongoose = require('mongoose');

// Schéma des ressources (objet contenant nom, type, quantite)
const ressourceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type: { type: String, required: true },
  quantite: { type: Number, required: true, default: 0 }
}, { _id: false }); // on évite d'avoir un _id inutile pour chaque ressource

// Schéma principal du groupe
const groupSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  chef: { type: String, required: true }, // ID Discord du chef
  membres: [{ type: String }], // liste des IDs Discord
  ressources: [ressourceSchema],
  pnjs: [{ type: String }] // noms ou identifiants des PNJ associés
}, { timestamps: true }); // ajoute createdAt / updatedAt

module.exports = mongoose.model('Group', groupSchema);
