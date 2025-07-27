const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET /api/reviews/:movieId - Public route to get all reviews for a movie
router.get('/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch movie reviews' });
  }
});

module.exports = router;
