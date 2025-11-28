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
      
      // Check if MONGODB_URI is set
      if (!process.env.MONGODB_URI) {
        const errorMsg = 'MONGODB_URI environment variable is not set. Please set it in Vercel environment variables.';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Log that URI is set (but don't log the actual URI for security)
      console.log('MONGODB_URI is set');
      const uriLength = process.env.MONGODB_URI.length;
      console.log(`MONGODB_URI length: ${uriLength} characters`);
      
      // Check if URI looks valid
      if (!process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
        const errorMsg = 'MONGODB_URI must start with mongodb:// or mongodb+srv://';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000, // Increased from 5000
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000, // Added explicit connect timeout
        retryWrites: true,
        w: 'majority'
      };

      console.log('Connecting with options:', JSON.stringify(opts, null, 2));

      cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
        console.log(`MongoDB Connected successfully to: ${mongoose.connection.host}`);
        console.log(`Database name: ${mongoose.connection.name}`);
        return mongoose;
      }).catch((err) => {
        console.error('Mongoose connect error details:');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        if (err.reason) {
          console.error('Error reason:', err.reason);
        }
        throw err;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Error name:', error.name);
    console.error('Full error:', error);
    
    // Provide more helpful error messages
    let userFriendlyError = error.message;
    
    if (error.message.includes('authentication failed')) {
      userFriendlyError = 'MongoDB authentication failed. Please check your username and password in MONGODB_URI.';
    } else if (error.message.includes('timeout')) {
      userFriendlyError = 'MongoDB connection timeout. Please check your network connection and MongoDB Atlas IP whitelist settings.';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      userFriendlyError = 'Cannot resolve MongoDB hostname. Please check your MONGODB_URI connection string.';
    } else if (error.message.includes('not set')) {
      userFriendlyError = 'MONGODB_URI environment variable is not set in Vercel. Please add it in your Vercel project settings.';
    }
    
    cached.promise = null; // Reset promise on error so we can retry
    throw new Error(userFriendlyError);
  }
};

module.exports = connectDB;