const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files like index.html and map.js

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres', // Database username   
  host: 'localhost',
  database: 'waste_management', // Your database name
  password: 'jhaye.play', // Your PostgreSQL password
  port: 5432, // PostgreSQL port (default is 5432)
});

// Create trashcans table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS trashcans (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL
  )
`);

// API to fetch all trash cans
app.get('/api/trashcans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trashcans');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// API to add a new trash can
app.post('/api/trashcans', async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO trashcans (latitude, longitude) VALUES ($1, $2) RETURNING *',
      [latitude, longitude]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
