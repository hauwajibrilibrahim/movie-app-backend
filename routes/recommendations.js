const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const verifyToken = require('../middleware/verifyToken'); 

router.get('/', verifyToken, getRecommendations);
module.exports = router;
