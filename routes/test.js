const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

router.get('/test-recommendations', async (req, res) => {
  try {
    const movieId = '527774'; // Raya and the Last Dragon
    const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}`;

    const response = await axios.get(tmdbUrl);

    return res.status(200).json({
      success: true,
      results: response.data.results
    });
  } catch (error) {
    console.error("TMDB direct test error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;
