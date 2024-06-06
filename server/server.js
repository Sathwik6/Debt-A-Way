import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { connectDB } from './db/config.js'
import authUser from './api/routes/user/userRoutes.js'
import authRoutes from './api/routes/auth/authRoutes.js'

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const allowedOrigin = 'http://localhost:5173';

// CORS configuration
const corsOptions = {
  origin: allowedOrigin,
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200
};

// Middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/routes/user', authUser);
app.use('/api/routes/auth', authRoutes);

// Connect to the database and start the server
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});