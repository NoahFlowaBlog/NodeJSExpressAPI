const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const userRoutes = require('./API/users/userRoutes.js');

const app = express();

// Define your variables
const DB_NAME = 'HashAPI';
const DB_USER = 'root';
const DB_PASSWORD = 'rootpassword';
const DB_HOST = 'your-db-hostname.com';
const DB_PORT = '1009';
// Database connection
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));


app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});