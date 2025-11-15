require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Dynamic CORS
const allowedOrigins = process.env.CLIENT_URLS.split(',');
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: This origin ${origin} is not allowed.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('PathWise Backend API is running 🚀');
});

// Server
const PORT = process.env.PORT || 1180;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
