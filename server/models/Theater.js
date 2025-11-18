import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true,
            trim: true
        },
        location: { 
            type: String, 
            required: true 
        },
        district: { 
            type: String, 
            required: true 
        },
        city: { 
            type: String, 
            default: 'Ho Chi Minh City' 
        },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        },
        rating: { 
            type: Number, 
            default: 4.5,
            min: 0,
            max: 5
        },
        facilities: {
            type: [String],
            default: ['Standard Seating', 'Air Conditioning', 'Parking']
        },
        screens: {
            type: Number,
            default: 5
        },
        // Lịch chiếu mẫu (có thể customize)
        schedule: {
            type: [String],
            default: ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM']
        },
        phone: { 
            type: String 
        },
        image: {
            type: String,
            default: 'https://placehold.co/800x450/1a1a1a/FFFFFF?text=Theater'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

// Index để tìm kiếm nhanh
theaterSchema.index({ name: 'text', location: 'text', district: 'text' });

const Theater = mongoose.model('Theater', theaterSchema);

export default Theater;