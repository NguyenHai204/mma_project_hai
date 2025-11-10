const SavedWord = require('../models/savedword.model');
const Vocab = require('../models/vocabulary.model');
// Lưu 1 từ vào danh sách của người dùng
exports.saveWord = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ middleware auth
    const { vocab } = req.body;

    // Kiểm tra nếu đã lưu từ này rồi thì không lưu lại nữa
    const existing = await SavedWord.findOne({ user: userId, vocab });
    if (existing) {
      return res.status(400).json({ message: 'Từ này đã được lưu trước đó.' });
    }

    const saved = await SavedWord.create({ user: userId, vocab });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả từ đã lưu của người dùng
exports.getSavedWords = async (req, res) => {
  try {
    const saved = await SavedWord.find({ user: req.user._id })
      .populate({
        path: 'vocab',
        select: 'word meaning imageUrl audioUrl level category',
      });

    res.json(saved);
  } catch (err) {
    console.error('Lỗi khi lấy saved words:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Xoá 1 từ khỏi danh sách đã lưu
exports.deleteSavedWord = async (req, res) => {
  try {
    const userId = req.user.id;
    const savedWordId = req.params.id;

    const deleted = await SavedWord.findOneAndDelete({ _id: savedWordId, user: userId });
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy từ đã lưu' });
    }

    res.json({ message: 'Đã xoá từ đã lưu' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
