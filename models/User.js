const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  favorites: [
    {
      movieId: String,
      title: String,
      posterPath: String,
    },
  ],
  watchlist: [
    {
      movieId: String,
      title: String,
      posterPath: String,
      genre: String,
      releaseDate: String,
    }
  ],
  reviews: [
    {
      movieId: String,
      movieTitle: String,
      reviewText: String,
      rating: Number,
      createdAt: { type: Date, default: Date.now },
    }
  ],
  ratedMovies: [
    {
      movieId: String,
      title: String,
      rating: Number,
    }
  ],

  recentlyViewed: [
    {
      movieId: String,
      title: String,
      viewedAt: { type: Date, default: Date.now }
    }
  ],
},

{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
