const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Review = require("../models/Review");

// Submit or update a review
router.post('/review', verifyToken, async (req, res) => {
  try {
    const { movieId, movieTitle, reviewText, starRating } = req.body;
    const userId = req.user.id;

    // Check if user has already submitted a review for this movie
    const existingReview = await Review.findOne({ user: userId, movieId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie.' });
    }

    const review = new Review({
      user: userId,
      movieId,
      movieTitle,
      reviewText,
      starRating,
    });

    await review.save();
    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error submitting review.' });
  }
});

// GET /api/user/reviews - Get all reviews by the logged-in user
router.get('/reviews', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.find({ user: userId })
      .select('movieTitle movieId reviewText starRating createdAt updatedAt')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});
/// GET /api/reviews/:movieId - Public route to get all reviews for a movie
router.get('/reviews/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId })
      .populate('user', 'name') // only get user's name
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch movie reviews' });
  }
});

// PUT /api/user/review/:id - Update a review
router.put('/review/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;
    const { reviewText, starRating } = req.body;

    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    review.reviewText = reviewText;
    review.starRating = starRating;
    await review.save();

    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
});

// DELETE /api/user/review/:id - Delete a review
router.delete('/review/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;

    const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

module.exports = router;
