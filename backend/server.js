// server.js

// Import necessary dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from the .env file
dotenv.config();

// Create an Express application
const app = express();

// Define the MongoDB connection URI
const mongoURI = process.env.MONGO_PASS;

// Connect to the MongoDB database
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Define a schema for click locations
const clickLocationSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  selectedCharacter: String,
});



// Define a schema for characters
const characterSchema = new mongoose.Schema({
  name: String,
  image: String,
  x: Number,
  y: Number,
});


// Create a model based on the schema
const ClickLocation = mongoose.model('ClickLocation', clickLocationSchema);
const CharacterModel = mongoose.model('Character', characterSchema);

// Middleware to parse JSON data
app.use(express.json());
app.use(cors());
// Create an API endpoint to save click locations
app.post('/api/saveClickLocation', async (req, res) => {
  const { x, y, selectedCharacter } = req.body;
  const clickLocation = new ClickLocation({ x, y, selectedCharacter });

  try {
    const savedLocation = await clickLocation.save();
    res.json({ message: 'Click location saved successfully', location: savedLocation });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while saving the click location' });
  }
});


// Create an API endpoint to match click locations
app.post('/api/matchClickLocation', async (req, res) => {
  const { x, y } = req.body;

  try {
    // Find all characters with matching x and y coordinates
    const characters = await CharacterModel.find({ x, y });

    if (characters.length > 0) {
      // If characters are found at the same location, return the characters
      res.json({ message: 'Characters found at this location', characters });
    } else {
      // If no characters are found, return a message
      res.json({ message: 'No characters found at this location' });
    }
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while matching characters' });
  }
});


// Create an API endpoint to get all characters
app.get('/api/characters', async (req, res) => {
  try {
    const characters = await CharacterModel.find({});
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while retrieving characters' });
  }
});


// Set the server port (use process.env.PORT or 3000 by default)
const port = process.env.PORT || 3000;

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
