const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PNJSchema = new Schema({
    nom: { type: String, required: true },
    description: String,
    groupe: { type: Schema.Types.ObjectId, ref: 'Groupe' },
    role: String
});

module.exports = mongoose.model('PNJ', PNJSchema);