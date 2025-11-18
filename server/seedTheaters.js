import mongoose from 'mongoose';
import Theater from './models/Theater.js';
import 'dotenv/config';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/cinebook`)
        console.log('MongoDB connected successfully');
        console.log('📦 Database name:', mongoose.connection.name); // ⭐ LOG DATABASE NAME
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

// Sample theater data for HCMC
const theaterData = [
    {
        name: 'QuickShow Cinema Center',
        location: '123 Nguyen Hue Street, District 1',
        district: 'District 1',
        city: 'Ho Chi Minh City',
        coordinates: { lat: 10.7769, lng: 106.7009 },
        rating: 4.8,
        facilities: ['IMAX', 'VIP Lounge', '4DX', 'Dolby Atmos', 'Food Court', 'Parking'],
        screens: 12,
        schedule: ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM', '9:30 PM', '11:45 PM'],
        phone: '+84 28 3822 5678',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop'
    },
    {
        name: 'QuickShow Cinema South',
        location: '456 Nguyen Van Linh Blvd, District 7',
        district: 'District 7',
        city: 'Ho Chi Minh City',
        coordinates: { lat: 10.7329, lng: 106.7196 },
        rating: 4.6,
        facilities: ['Premium Seating', 'Dolby Atmos', 'Concession Stand', 'Parking', 'Arcade'],
        screens: 8,
        schedule: ['10:00 AM', '12:30 PM', '3:00 PM', '5:30 PM', '8:00 PM', '10:30 PM'],
        phone: '+84 28 5412 9876',
        image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=450&fit=crop'
    },
    {
        name: 'QuickShow Cinema East',
        location: '789 Vo Van Ngan Street, Thu Duc City',
        district: 'Thu Duc City',
        city: 'Ho Chi Minh City',
        coordinates: { lat: 10.8505, lng: 106.7719 },
        rating: 4.7,
        facilities: ['ScreenX', 'Luxury Recliners', 'Coffee Shop', 'Free WiFi', 'Parking'],
        screens: 10,
        schedule: ['9:30 AM', '12:00 PM', '2:30 PM', '5:00 PM', '7:30 PM', '10:00 PM'],
        phone: '+84 28 3724 5432',
        image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=450&fit=crop'
    },
    {
        name: 'QuickShow Cinema Landmark',
        location: '20E Cong Hoa Street, Tan Binh District',
        district: 'Tan Binh District',
        city: 'Ho Chi Minh City',
        coordinates: { lat: 10.8013, lng: 106.6524 },
        rating: 4.5,
        facilities: ['Standard Seating', 'Dolby Digital', 'Snack Bar', 'Air Conditioning'],
        screens: 6,
        schedule: ['10:30 AM', '1:00 PM', '3:30 PM', '6:00 PM', '8:30 PM', '11:00 PM'],
        phone: '+84 28 3844 6789',
        image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop'
    },
    {
        name: 'QuickShow Cinema Mega',
        location: '100 Le Lai Street, District 1',
        district: 'District 1',
        city: 'Ho Chi Minh City',
        coordinates: { lat: 10.7703, lng: 106.6963 },
        rating: 4.9,
        facilities: ['IMAX Laser', 'VIP Suites', 'Fine Dining', 'Valet Parking', 'Private Screening Rooms'],
        screens: 15,
        schedule: ['8:00 AM', '10:30 AM', '1:00 PM', '3:30 PM', '6:00 PM', '8:30 PM', '11:00 PM'],
        phone: '+84 28 3829 1234',
        image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&h=450&fit=crop'
    },
    {
        name: 'QuickShow Cinema Binh Thanh',
        location: '55 Xo Viet Nghe Tinh, Binh Thanh District',
        district: 'Binh Thanh District',
        city: 'Ho Chi Minh City',
        coordinates: { lat: 10.8075, lng: 106.7046 },
        rating: 4.4,
        facilities: ['Standard Seating', 'Air Conditioning', 'Parking', 'Food Court'],
        screens: 7,
        schedule: ['11:00 AM', '1:30 PM', '4:00 PM', '6:30 PM', '9:00 PM'],
        phone: '+84 28 3514 8765',
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop'
    }
];

// Seed function
const seedTheaters = async () => {
    try {
        await connectDB();
        
        // Clear existing theaters
        await Theater.deleteMany({});
        console.log('Existing theaters cleared');
        
        // Insert new theaters
        const theaters = await Theater.insertMany(theaterData);
        console.log(`${theaters.length} theaters seeded successfully`);
        
        // Display seeded theaters
        theaters.forEach(theater => {
            console.log(`✓ ${theater.name} - ${theater.district} - Rating: ${theater.rating}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding theaters:', error.message);
        process.exit(1);
    }
};

// Run seed
seedTheaters();