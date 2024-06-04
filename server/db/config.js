import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1);
    }
};

export { prisma, connectDB };
