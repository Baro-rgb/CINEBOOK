import express from 'express';
import { 
    getFavorites, 
    getUserBookings, 
    updateFavorite,
    addToFavorites,      // ⭐ NEW
    removeFavorite       // ⭐ NEW
} from '../controllers/userController.js';

const userRouter = express.Router();

// Bookings
userRouter.get('/bookings', getUserBookings);

// Favorites
userRouter.get('/favorites', getFavorites);
userRouter.post('/favorites/add', addToFavorites);           // ⭐ NEW - Add to favorites
userRouter.delete('/favorites/:movieId', removeFavorite);    // ⭐ NEW - Remove from favorites
userRouter.post('/update-favorite', updateFavorite);         // OLD - Toggle (keep for compatibility)

export default userRouter;