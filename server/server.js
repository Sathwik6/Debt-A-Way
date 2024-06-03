import express from 'express';
import cors from 'cors';
// import sequelize from './db/config.js';

const app = express();

app.use(cors());
app.use(express.json());

// Test database connection
// sequelize.authenticate()
//   .then(() => console.log('Database connected...'))
//   .catch(err => console.log('Error: ' + err));

// Define routes here

const PORT = 5016;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
