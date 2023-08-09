const express = require('express');
const { Sequelize, Model, DataTypes } = require('sequelize');
const router = express.Router();

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

class User extends Model {}

User.init({
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FirstName: DataTypes.STRING,
  LastName: DataTypes.STRING,
  Birthday: DataTypes.DATE,
  FavoriteGame: DataTypes.STRING,
  DateCreated: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, { 
  sequelize, 
  modelName: 'User',
  tableName: 'Users',
  timestamps: false
});

// Create a new user
router.post('/', async (req, res) => {
    const {
      FirstName,
      LastName,
      Birthday,
      FavoriteGame
    } = req.body;
  
    try {
      const newUser = await User.create({
        FirstName,
        LastName,
        Birthday,
        FavoriteGame
      });
  
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create a new user' });
    }
});
  
// Get all users
router.get('/', async (req, res) => {
try {
    const users = await User.findAll();
    res.json(users);
} catch (error) {
    console.error(error);  // Log the error details to the console
    res.status(500).json({ error: 'Failed to retrieve users', message: error.message });
}
});
  
// Get a user by ID
router.get('/:id', async (req, res) => {
const { id } = req.params;

try {
    const user = await User.findOne({ where: { UserID: id } });
    if (user) {
    res.json(user);
    } else {
    res.status(404).json({ error: 'User not found' });
    }
} catch (error) {
    console.error(error);  // Log the error details to the console
    res.status(500).json({ error: 'Failed to retrieve the user', message: error.message });
}
});
  
// Update a user by ID
router.put('/:id', async (req, res) => {
const { id } = req.params;
const {
    FirstName,
    LastName,
    Birthday,
    FavoriteGame
} = req.body;

try {
    const user = await User.findOne({ where: { UserID: id } });
    if (user) {
    user.FirstName = FirstName || user.FirstName;
    user.LastName = LastName || user.LastName;
    user.Birthday = Birthday || user.Birthday;
    user.FavoriteGame = FavoriteGame || user.FavoriteGame;

    await user.save();
    res.json(user);
    } else {
    res.status(404).json({ error: 'User not found' });
    }
} catch (error) {
    res.status(500).json({ error: 'Failed to update the user' });
}
});
  
// Delete a user by ID
router.delete('/:id', async (req, res) => {
const { id } = req.params;

try {
    const user = await User.findOne({ where: { UserID: id } });
    if (user) {
    await user.destroy();
    res.status(204).send();
    } else {
    res.status(404).json({ error: 'User not found' });
    }
} catch (error) {
    res.status(500).json({ error: 'Failed to delete the user' });
}
});
  
module.exports = router;