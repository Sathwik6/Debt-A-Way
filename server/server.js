import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import { connectDB } from './db/config.js'
import authRoutes from './api/routes/authRoutes.js'

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Connect to the database and start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database:', err);
});