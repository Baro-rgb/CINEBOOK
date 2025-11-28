import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    // ⭐ OPTIONAL: Nếu muốn lưu favorites trong MongoDB thay vì Clerk
    // favorites: [{ 
    //     type: String, 
    //     ref: 'Movie' 
    // }],
}, { 
    timestamps: true  // Add createdAt, updatedAt
});

const User = mongoose.model('User', userSchema);

export default User;

// ============================================
// NOTE: 
// Hiện tại đang dùng Clerk privateMetadata để lưu favorites
// Nếu muốn migrate sang MongoDB, uncomment field favorites
// và cập nhật userController.js để dùng MongoDB thay vì Clerk
// ============================================