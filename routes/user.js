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

module.exports = router;