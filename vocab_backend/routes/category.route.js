const express = require("express");
const router = express.Router();
const { createCategory, getCategories, updateCategory,deleteCategory } = require("../controllers/category.controller");
const { auth, adminOnly } = require("../middlewares/auth.middleware");

router.post("/", auth, adminOnly, createCategory);  // Chỉ admin được tạo
router.get("/", getCategories);                     // Ai cũng có thể xem
router.put("/:id", auth, adminOnly, updateCategory);
router.delete("/:id", auth, adminOnly, deleteCategory);

module.exports = router;
