const express = require('express');
const cors = require('cors');
const spacesRoutes = require('./routes/spaces');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow CORS with the correct options
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend running on port 3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

// Add Content Security Policy (CSP) header
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'none'; connect-src 'self' http://localhost:5000; script-src 'self';");
  next();
});

app.use(express.json()); // To parse incoming JSON requests

// Define API routes
app.use('/api/spaces', spacesRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});

module.exports = app;
