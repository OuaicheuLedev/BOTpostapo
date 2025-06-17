const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RessourceSchema = new Schema({
    nom: { type: String, required: true },
    type: { type: String, required: true },
    quantite: { type: Number, default: 0 },
    groupe: { type: Schema.Types.ObjectId, ref: 'Groupe' }
});

module.exports = mongoose.model('Ressource', RessourceSchema);