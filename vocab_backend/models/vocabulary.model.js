const mongoose = require("mongoose");

const vocabularySchema = new mongoose.Schema({
  word: { type: String, required: true},
  meaning: { type: String, required: true},
  audioUrl: String,
  imageUrl: String,
  level: { type: String, enum: ["A1", "A2", "B1", "B2", "C1","C2"] },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
}, { timestamps: true });

module.exports = mongoose.model("Vocabulary", vocabularySchema);
