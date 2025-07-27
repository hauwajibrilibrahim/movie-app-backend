
# MovieMuse Backend API

This is the backend for **MovieMuse**, a full-stack movie recommendation web application built using **Node.js**, **Express.js**, and **MongoDB**. The backend handles user authentication, movie interactions (favorites, watchlists), and movie reviews.

## Features

- User registration and login (JWT authentication)
- Save and remove favorite movies
- Add and manage watchlists
- Submit, update, and delete movie reviews
- Personalized movie recommendations using TMDB API

## Technologies Used

- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcrypt for password hashing
- TMDB API for movie data

## API Endpoints

### Auth Routes

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT

### User Profile

- `GET /api/user/profile` — Get logged-in user profile (protected route)

### Favorites

- `POST /api/user/favorite` — Add movie to favorites
- `DELETE /api/user/favorite/:id` — Remove movie from favorites
- `GET /api/user/favorites` — Get all favorite movies

### Watchlist

- `POST /api/user/watchlist` — Add movie to watchlist
- `DELETE /api/user/watchlist/:id` — Remove movie from watchlist
- `GET /api/user/watchlist` — Get all watchlist movies

### Reviews

- `POST /api/user/review` — Submit a review for a movie
- `GET /api/user/reviews` — Get all reviews by the user
- `PUT /api/user/review/:id` — Update a review
- `DELETE /api/user/review/:id` — Delete a review

### Public Reviews

- `GET /api/reviews/:movieId` — Get all reviews for a specific movie
### Live URL
- [https://movie-muse.onrender.com]
## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- TMDB API Key

### Installation

1. Clone the repo:
```bash
git clone https://github.com/hauwajibrilibrahim/movie-app-backend.git
cd movie-app-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
```

4. Start the server:
```bash
npm run dev
```

Server should run on `http://localhost:5000`

### 👨‍💻 Author
Name: Hauwa’u Jibril Ibrahim

Frontend Repo: Movie Muse Frontend [https://github.com/hauwajibrilibrahim/movie-app-frontend]

Backend Repo: Movie Muse Backend[https://github.com/hauwajibrilibrahim/movie-app-backend]

## License

This project is licensed under the MIT License.
