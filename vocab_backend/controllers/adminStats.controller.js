const Category = require('../models/category.model');
const Vocab = require('../models/vocabulary.model');
const User = require('../models/user.model');

const getAdminStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const totalVocab = await Vocab.countDocuments();

    const now = new Date();
    const currentMonth = now.getMonth() + 1; // tháng hiện tại (1 - 12)
    const currentYear = now.getFullYear();

    const currentMonthStart = new Date(currentYear, now.getMonth(), 1);
    const currentMonthEnd = new Date(currentYear, now.getMonth() + 1, 0);

    const userStatsRaw = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: currentMonthStart,
            $lte: currentMonthEnd,
          },
        },
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    // ✅ Format trả về: { day: 12, count: 4 }
    const userStats = userStatsRaw.map((item) => ({
      day: item._id.day,
      count: item.count,
    }));

    res.json({
      totalCategories,
      totalVocab,
      currentMonth, // gửi thêm tháng để frontend tự format "dd/mm"
      userStats,
    });
  } catch (err) {
    console.error('Lỗi thống kê admin:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

module.exports = { getAdminStats };
