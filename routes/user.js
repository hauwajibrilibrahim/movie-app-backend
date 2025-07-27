const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");
const Review = require("../models/Review");

// GET user profile 
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select('username email favorites watchlist') // select needed fields
      .lean(); // convert to plain object

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const reviews = await Review.find({ user: userId })
      .select('movieTitle starRating reviewText createdAt updatedAt movieId')
      .sort({ createdAt: -1 });

    // Combine user info and reviews
    const profileData = {
      ...user,
      reviews,
    };

    res.json(profileData);
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Get user favorites
router.get("/favorites", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Error fetching favorites" });
  }
});

// Add to favorites
router.post("/favorites", verifyToken, async (req, res) => {
  const { movieId, title, posterPath } = req.body;
  try {
    const user = await User.findById(req.user.id);

    const alreadyFavorited = user.favorites.some(
      (fav) => fav.movieId === movieId
    );
    if (alreadyFavorited) {
      return res.status(400).json({ message: "Movie already in favorites" });
    }

    user.favorites.push({ movieId, title, posterPath });
    await user.save();
    res.status(201).json({ message: "Added to favorites", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Error adding to favorites" });
  }
});

// Remove from favorites
router.delete("/favorites/:movieId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(
      (fav) => fav.movieId !== req.params.movieId
    );
    await user.save();
    res.json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Error removing from favorites" });
  }
});

// Get watchlist
router.get("/watchlist", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ message: "Error fetching watchlist" });
  }
});

// Add to watchlist
router.post("/watchlist", verifyToken, async (req, res) => {
  const { movieId, title, posterPath } = req.body;
  try {
    const user = await User.findById(req.user.id);

    const alreadyInWatchlist = user.watchlist.some(
      (movie) => movie.movieId === movieId
    );
    if (alreadyInWatchlist) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    user.watchlist.push({ movieId, title, posterPath });
    await user.save();
    res.status(201).json({ message: "Added to watchlist", watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: "Error adding to watchlist" });
  }
});

// Remove from watchlist
router.delete("/watchlist/:movieId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.watchlist = user.watchlist.filter(
      (movie) => movie.movieId !== req.params.movieId
    );
    await user.save();
    res.json({ message: "Removed from watchlist", watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: "Error removing from watchlist" });
  }
});

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
