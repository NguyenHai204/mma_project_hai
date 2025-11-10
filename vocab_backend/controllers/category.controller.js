const Category = require("../models/category.model");
const Vocab = require("../models/vocabulary.model");

exports.createCategory = async (req, res) => {
  try {
    const { name, backgroundImage } = req.body;
    const category = await Category.create({ name, backgroundImage });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, backgroundImage } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, backgroundImage },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const relatedWords = await Vocab.findOne({ category: id });
    if (relatedWords) {
      return res.status(400).json({
        message: "Không thể xóa vì vẫn còn từ vựng thuộc chủ đề này",
      });
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }

    res.json({ message: "Đã xóa category thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
