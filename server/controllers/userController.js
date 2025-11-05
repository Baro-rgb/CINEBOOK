import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";


// api controller functions to get user booking
export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth().userId;


        const bookings = await Booking.find({user}).populate({path:'show', populate:{path:'movie'}}).sort({createdAt:-1});
        res.json({success:true, bookings});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// api controller function to update favorite movie in clerk user metadata
export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const { userId } = req.auth;

    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata.favorites || [];

    // Nếu đã có movieId thì xóa, nếu chưa thì thêm vào
    let updatedFavorites;
    if (favorites.includes(movieId)) {
      updatedFavorites = favorites.filter(item => item !== movieId);
    } else {
      updatedFavorites = [...favorites, movieId];
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { favorites: updatedFavorites },
    });

    res.json({
      success: true,
      message: favorites.includes(movieId)
        ? "Removed from favorites"
        : "Added to favorites",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export const getFavorites = async (req, res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId);
        const favorites = user.privateMetadata.favorites;

        // getting movie details from database
        const movies = await Movie.find({_id: {$in: favorites}})

        res.json({success:true, movies});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}