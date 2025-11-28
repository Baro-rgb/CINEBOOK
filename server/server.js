import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRouter.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import theaterRouter from './routes/theaterRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhook.js';

const app = express();
const port = 3000;

await connectDB()

//stripe webhook route (MUST be before express.json())
app.use('/api/stripe', express.raw({
    type:'application/json'
}), stripeWebhooks)

// Middleware - ORDER MATTERS! ⭐
app.use(cors());                 // 1. CORS first
app.use(express.json());         // 2. JSON parser
app.use(clerkMiddleware());      // 3. Clerk auth last ⭐

// API Routes
app.get('/', (req, res)=> res.send('Server is Live!'))
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)
app.use('/api/theater', theaterRouter)

app.listen(port, ()=> console.log(`Server listening at http://localhost:${port}`));