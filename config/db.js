const mongoose = require('mongoose');

// Cache the connection to reuse across serverless function invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    // Check if we already have a connection
    if (cached.conn) {
      console.log('Using existing MongoDB connection');
      return cached.conn;
    }

    // Check if we have a connection promise in progress
    if (!cached.promise) {
      console.log('Attempting to connect to MongoDB...');
      console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is NOT set');
      
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
      }

      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Full error:', error);
    cached.promise = null; // Reset promise on error so we can retry
    throw error; // Don't exit process in serverless environment
  }
};

module.exports = connectDB;