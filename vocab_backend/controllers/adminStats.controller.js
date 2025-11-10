const Category = require('../models/category.model');
const Vocab = require('../models/vocabulary.model');
const User = require('../models/user.model');

const getAdminStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const totalVocab = await Vocab.countDocuments();

    const now = new Date();
const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

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
      _id: {
        day: { $dayOfMonth: '$createdAt' },
        month: { $month: '$createdAt' },
      },
      count: { $sum: 1 },
    },
  },
  {
    $sort: { '_id.day': 1 },
  },
]);

// Format lại thành chuỗi ngày/tháng: "20/7"
const userStats = userStatsRaw.map(item => ({
  day: `${item._id.day}/${item._id.month}`,
  count: item.count,
}));


    res.json({
      totalCategories,
      totalVocab,
      userStats,
    });
  } catch (err) {
    console.error('Lỗi thống kê admin:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

module.exports = { getAdminStats };
