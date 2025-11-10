const Vocabulary = require("../models/vocabulary.model");

exports.createVocab = async (req, res) => {
  try {
    const { word, meaning, audioUrl, imageUrl, level, category } = req.body;
    const vocab = await Vocabulary.create({
      word, meaning, audioUrl, imageUrl, level, category
    });
    res.status(201).json(vocab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllVocab = async (req, res) => {
  try {
    const vocabs = await Vocabulary.find()
      .populate("category");
    res.json(vocabs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateVocab = async (req, res) => {
  try {
    const vocab = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!vocab) return res.status(404).json({ message: "Vocab not found" });
    res.json(vocab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteVocab = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Vocabulary.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy từ vựng' });

    res.json({ message: 'Đã xóa thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

