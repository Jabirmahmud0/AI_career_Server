const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: ['https://careerbyai.vercel.app', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

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