import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

// API to get user bookings
export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth().userId;

        const bookings = await Booking.find({user})
            .populate({path:'show', populate:{path:'movie'}})
            .sort({createdAt:-1});
            
        res.json({success:true, bookings});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// API to get user's favorite movies
export const getFavorites = async (req, res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId);
        const favorites = user.privateMetadata.favorites || [];

        // Getting movie details from database
        const movies = await Movie.find({_id: {$in: favorites}});

        res.json({success:true, movies});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// ⭐ NEW: API to add movie to favorites
export const addToFavorites = async (req, res) => {
    try {
        const { movieId } = req.body;
        const { userId } = req.auth();

        // Validate movieId
        if (!movieId) {
            return res.json({ success: false, message: 'Movie ID is required' });
        }

        // Check if movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.json({ success: false, message: 'Movie not found' });
        }

        // Get user from Clerk
        const user = await clerkClient.users.getUser(userId);
        const favorites = user.privateMetadata.favorites || [];

        // Check if already in favorites
        if (favorites.includes(movieId)) {
            return res.json({ 
                success: false, 
                message: 'Phim đã có trong danh sách yêu thích' 
            });
        }

        // Add to favorites
        const updatedFavorites = [...favorites, movieId];

        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: { favorites: updatedFavorites },
        });

        res.json({
            success: true,
            message: 'Đã thêm vào yêu thích',
            favorites: updatedFavorites
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ⭐ NEW: API to remove movie from favorites
export const removeFavorite = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { userId } = req.auth();

        // Get user from Clerk
        const user = await clerkClient.users.getUser(userId);
        const favorites = user.privateMetadata.favorites || [];

        // Check if movie is in favorites
        if (!favorites.includes(movieId)) {
            return res.json({ 
                success: false, 
                message: 'Phim không có trong danh sách yêu thích' 
            });
        }

        // Remove from favorites
        const updatedFavorites = favorites.filter(item => item !== movieId);

        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: { favorites: updatedFavorites },
        });

        res.json({
            success: true,
            message: 'Đã xóa khỏi yêu thích',
            favorites: updatedFavorites
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ⭐ UPDATED: Toggle favorite (giữ lại cho backward compatibility)
export const updateFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;
        const { userId } = req.auth();

        const user = await clerkClient.users.getUser(userId);
        const favorites = user.privateMetadata.favorites || [];

        // Toggle: Nếu đã có thì xóa, chưa có thì thêm
        let updatedFavorites;
        const isRemoving = favorites.includes(movieId);
        
        if (isRemoving) {
            updatedFavorites = favorites.filter(item => item !== movieId);
        } else {
            updatedFavorites = [...favorites, movieId];
        }

        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: { favorites: updatedFavorites },
        });

        res.json({
            success: true,
            message: isRemoving ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
            favorites: updatedFavorites
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};