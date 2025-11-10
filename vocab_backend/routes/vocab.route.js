const express = require("express");
const router = express.Router();
const { createVocab, getAllVocab,updateVocab,deleteVocab } = require("../controllers/vocab.controller");
const { auth, adminOnly } = require("../middlewares/auth.middleware");

router.post("/", auth, adminOnly, createVocab);  // Chỉ admin được thêm từ
router.get("/", auth, getAllVocab);              // Người dùng cần đăng nhập để xem
router.put('/:id', auth, updateVocab);
router.delete('/:id', auth, deleteVocab);

module.exports = router;
