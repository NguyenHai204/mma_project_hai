const Category = require("../models/category.model");
const Vocab = require("../models/vocabulary.model");

/**
 * ✅ Tạo Category
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, backgroundImage } = req.body;

    if (!name || !backgroundImage) {
      return res.status(400).json({ message: "Tên và ảnh nền là bắt buộc" });
    }

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category đã tồn tại" });

    const newCategory = await Category.create({ name, backgroundImage });

    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi tạo category", error: error.message });
  }
};

/**
 * ✅ Lấy danh sách Category
 */
exports.getCategories = async (req, res) => {
  try {
    const result = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Không thể lấy danh sách category" });
  }
};

/**
 * ✅ Cập nhật Category
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, backgroundImage } = req.body;

    if (!name) return res.status(400).json({ message: "Tên không được để trống" });

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, backgroundImage },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy category" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi cập nhật category", error: error.message });
  }
};

/**
 * ✅ Xóa Category (chỉ khi không có từ vựng thuộc category này)
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const vocabExists = await Vocab.exists({ category: id });
    if (vocabExists) {
      return res.status(400).json({
        message: "Không thể xóa vì vẫn còn từ vựng thuộc chủ đề này",
      });
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }

    return res.status(200).json({ message: "Xóa category thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Không thể xóa category", error: error.message });
  }
};
