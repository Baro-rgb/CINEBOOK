import Theater from "../models/Theater.js";

// API to get all theaters
export const getAllTheaters = async (req, res) => {
    try {
        const { search, district } = req.query;
        
        let query = { isActive: true };
        
        // Search by name or location
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter by district
        if (district && district !== 'all') {
            query.district = { $regex: district, $options: 'i' };
        }
        
        const theaters = await Theater.find(query).sort({ rating: -1, name: 1 });
        
        res.json({ success: true, theaters });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get a single theater by ID
export const getTheater = async (req, res) => {
    try {
        const { theaterId } = req.params;
        const theater = await Theater.findById(theaterId);
        
        if (!theater) {
            return res.json({ success: false, message: 'Theater not found' });
        }
        
        res.json({ success: true, theater });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to add a new theater (Admin only)
export const addTheater = async (req, res) => {
    try {
        const theaterData = req.body;
        const theater = await Theater.create(theaterData);
        
        res.json({ success: true, message: 'Theater added successfully', theater });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update theater (Admin only)
export const updateTheater = async (req, res) => {
    try {
        const { theaterId } = req.params;
        const updateData = req.body;
        
        const theater = await Theater.findByIdAndUpdate(
            theaterId, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!theater) {
            return res.json({ success: false, message: 'Theater not found' });
        }
        
        res.json({ success: true, message: 'Theater updated successfully', theater });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to delete theater (Admin only)
export const deleteTheater = async (req, res) => {
    try {
        const { theaterId } = req.params;
        
        // Soft delete by setting isActive to false
        const theater = await Theater.findByIdAndUpdate(
            theaterId, 
            { isActive: false }, 
            { new: true }
        );
        
        if (!theater) {
            return res.json({ success: false, message: 'Theater not found' });
        }
        
        res.json({ success: true, message: 'Theater deleted successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get unique districts
export const getDistricts = async (req, res) => {
    try {
        const districts = await Theater.distinct('district', { isActive: true });
        res.json({ success: true, districts: districts.sort() });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};