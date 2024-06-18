import path from 'path'
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const verifyToken =  (req, res, next) => {
  // Read the token from the cookie
  const token = req.cookies.token;
  console.log("Token: ", token);
  if (!token)
    return res.status(401).send("Access denied...No token provided...");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //decoded contains (username, iat, and exp)
    req.username = decoded.username;
    next();
  } catch (er) {
    //Incase of expired jwt or invalid token kill the token and clear the cookie
    res.clearCookie("token");
    return res.status(400).send(er.message);
  }
};

export default verifyToken;