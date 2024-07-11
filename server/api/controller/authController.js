import _ from 'lodash'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { jwtConfig } from '../../db/config.js'

const prisma = new PrismaClient();

// Handles user Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: email }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //just picks the username from the user object
        const userPayload = _.pick(user, ['username']);

        // Generate a JWT token
        const token = jwt.sign(userPayload, jwtConfig.secret, jwtConfig.options);

        // Store the token in an HTTP-only cookie
        res.cookie('token', token, { 
            httpOnly: true,
            secure: true, // Set secure flag to true when in production
        });

        // Send response to the client
        res.status(200).json({ message: 'Login successful'});
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};


// Handles user registration
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        
        res.status(200).json({ message: 'User Registration Successful', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

const logoutUser = (req, res, next) => {
    try {
        res.clearCookie("token");
        res.json({ success: true });
      } catch (error) {
        next(error);
    }
};





export { registerUser, loginUser, logoutUser};
