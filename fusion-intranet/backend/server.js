const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const usersRoutes = require('./routes/users');
const placesRoutes = require('./routes/places');
const documentsRoutes = require('./routes/documents');
const eventsRoutes = require('./routes/events');
const postsRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.json({
    message: 'FUSION Intranet API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      places: '/api/places',
      documents: '/api/documents',
      events: '/api/events',
      posts: '/api/posts'
    }
  });
});

app.use('/api/users', usersRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/posts', postsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`FUSION Intranet API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
