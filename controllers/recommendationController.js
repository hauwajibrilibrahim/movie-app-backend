const axios = require('axios');
const User = require('../models/User');

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const favoriteMovies = user.favorites || [];
    const ratedMovies = user.ratedMovies || [];

    const referenceMovie = favoriteMovies[0] || ratedMovies[0];
    if (!referenceMovie) {
      return res.status(200).json({
        message: 'Add some favorite or rated movies to get recommendations.',
        recommended: []
      });
    }

    const tmdbMovieId = referenceMovie.movieId;
    const apiKey = process.env.TMDB_API_KEY;

    const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbMovieId}/recommendations?api_key=${apiKey}&language=en-US&page=1`;

    const tmdbResponse = await axios.get(tmdbUrl);
    const recommendedMovies = tmdbResponse.data.results;

    return res.status(200).json({
      recommended: recommendedMovies
    });
  } catch (error) {
    console.error('TMDB Recommendation Error:', error.response?.data || error.message);
    return res.status(500).json({
      message: 'Failed to fetch recommendations',
      error: error.response?.data || error.message
    });
  }
};

module.exports = { getRecommendations };
