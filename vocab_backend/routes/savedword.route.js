const express = require('express');
const router = express.Router();
const savedWordController = require('../controllers/savedword.controller');
const { auth } = require("../middlewares/auth.middleware");

router.post('/', auth, savedWordController.saveWord);
router.get('/', auth, savedWordController.getSavedWords);
router.delete('/:id', auth, savedWordController.deleteSavedWord);

module.exports = router; 
