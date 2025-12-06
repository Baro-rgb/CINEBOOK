import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";



//API to check if user is admin
export const isAdmin = async (req, res) => {
    res.json({success:true, isAdmin:true});
}

// API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({isPaid: true})
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');


        const totalUsers = await User.countDocuments();

        const dashboardData = {
            totalbookings: bookings.length,
            totalRevenue: bookings.reduce( (acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUsers
        }

        res.json({success:true, dashboardData});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

//API to get all shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({showDateTime:{$gte: new Date()}}).populate('movie').sort({showDateTime:1});
        res.json({success:true, shows});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}


// API to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user').populate({path:'show', populate:{path:'movie'}}).sort({createdAt:-1})
        res.json({success:true, bookings});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// API to delete a booking
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Tìm booking cần xóa
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.json({success: false, message: "Booking not found"});
        }

        console.log("📌 Booking to delete:", booking);
        console.log("📌 Booked seats:", booking.bookedSeats);

        // Lấy show và xóa ghế khỏi occupiedSeats
        const show = await Show.findById(booking.show);
        if (show) {
            console.log("📌 BEFORE delete - occupiedSeats:", show.occupiedSeats);
            
            // Xóa từng ghế khỏi occupiedSeats object
            booking.bookedSeats.forEach(seat => {
                delete show.occupiedSeats[seat];
            });
            
            // ⭐ QUAN TRỌNG: Phải mark modified vì occupiedSeats là nested object
            show.markModified('occupiedSeats');
            await show.save();
            
            console.log("📌 AFTER delete - occupiedSeats:", show.occupiedSeats);
        }

        // Xóa booking khỏi database
        await Booking.findByIdAndDelete(id);
        
        res.json({success: true, message: "Booking deleted successfully"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}