const mongoose = require('mongoose');

const savedWordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vocab: { type: mongoose.Schema.Types.ObjectId, ref: 'Vocabulary', required: true },
  savedAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

module.exports = mongoose.model('SavedWord', savedWordSchema);
