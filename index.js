const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// Load environment variables
dotenv.config();

// Connect to database (lazy connection for serverless)
// Don't await here - let it connect on first request
connectDB().catch(err => {
  console.error('Initial DB connection error (will retry on first request):', err.message);
});

const app = express();

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: true, // Allow all origins for now
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Add a simple middleware to log requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Middleware to ensure DB connection before API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error in middleware:', error);
    console.error('Request path:', req.path);
    console.error('Request method:', req.method);
    
    // Provide more detailed error response
    const errorResponse = {
      message: 'Database connection failed',
      error: error.message,
      hint: 'Please check your Vercel environment variables (MONGODB_URI) and MongoDB Atlas settings.'
    };
    
    // In development, include more details
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.stack = error.stack;
    }
    
    res.status(500).json(errorResponse);
  }
});

// Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/profile', require('./routes/profile.js'));
app.use('/api/jobs', require('./routes/jobs.js'));
app.use('/api/resources', require('./routes/resources.js'));
app.use('/api/ai', require('./routes/ai.js'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Export the app for Vercel
module.exports = app;

// Only listen locally
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}